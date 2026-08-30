import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const connectionLimit = Number(process.env.DB_CONNECTION_LIMIT || 10)
const idleTimeout = Number(process.env.DB_IDLE_TIMEOUT || 60000)
const connectTimeout = Number(process.env.DB_CONNECT_TIMEOUT || 10000)
const keepAliveInterval = Number(process.env.DB_KEEPALIVE_INTERVAL || 25000)
const retryCount = Number(process.env.DB_RETRY_COUNT || 3)
const retryDelay = Number(process.env.DB_RETRY_DELAY || 300)

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit,
  maxIdle: connectionLimit,
  idleTimeout,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout,
  charset: 'utf8mb4',
})

const RETRYABLE_ERRORS = new Set([
  'PROTOCOL_CONNECTION_LOST',
  'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR',
  'PROTOCOL_ENQUEUE_AFTER_QUIT',
  'ECONNRESET',
  'EPIPE',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  'ER_SERVER_GONE_ERROR',
  'ER_SERVER_LOST',
  'ER_CON_COUNT_ERROR',
])

function isRetryableDbError(error) {
  const code = error?.code || ''
  const message = String(error?.message || '').toLowerCase()
  return RETRYABLE_ERRORS.has(code) ||
    message.includes('connection is closed') ||
    message.includes('closed state') ||
    message.includes('connection lost') ||
    message.includes('server has gone away') ||
    message.includes('server has gone away') ||
    message.includes('connection reset') ||
    message.includes('connection was closed')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Jalankan query dengan koneksi yang dipastikan sehat terlebih dahulu.
 * Jika MySQL memutus koneksi yang idle, koneksi rusak dihancurkan dan
 * percobaan berikutnya akan mengambil koneksi baru dari pool.
 */
export async function dbQuery(sql, params = []) {
  let lastError

  for (let attempt = 1; attempt <= retryCount; attempt += 1) {
    let connection

    try {
      connection = await pool.getConnection()
      await connection.ping()
      const result = await connection.query(sql, params)
      connection.release()
      connection = null
      return result
    } catch (error) {
      lastError = error

      if (connection) {
        try {
          // destroy() mengeluarkan koneksi yang rusak dari pool sehingga
          // request berikutnya tidak mendapatkan socket lama yang mati.
          connection.destroy()
        } catch {
          // abaikan error saat membersihkan koneksi rusak
        }
      }

      if (!isRetryableDbError(error) || attempt === retryCount) {
        throw error
      }

      console.warn(
        `Koneksi MySQL gagal (${error.code || error.message}). ` +
        `Mencoba koneksi baru ${attempt + 1}/${retryCount}...`
      )
      await sleep(retryDelay * attempt)
    }
  }

  throw lastError
}

async function warmupDatabase() {
  try {
    await dbQuery('SELECT 1 AS ok')
    console.log('Koneksi MySQL siap.')
  } catch (error) {
    console.warn(`Database belum siap saat startup: ${error.code || error.message}`)
  }
}

// Ping berkala mencegah koneksi idle terlalu lama. Timer ini juga tidak
// menghalangi proses Node untuk shutdown secara normal.
const keepAliveTimer = setInterval(async () => {
  try {
    await dbQuery('SELECT 1 AS ok')
  } catch (error) {
    console.warn(`DB keep-alive gagal: ${error.code || error.message}`)
  }
}, keepAliveInterval)

if (typeof keepAliveTimer.unref === 'function') keepAliveTimer.unref()

void warmupDatabase()

export default pool
