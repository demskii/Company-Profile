import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const required = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// MySQL cloud (TiDB Cloud, Railway, dll.) umumnya mewajibkan koneksi SSL/TLS.
// Aktifkan dengan DB_SSL=true. Jika penyedia memakai sertifikat self-signed dan koneksi gagal,
// set DB_SSL_REJECT_UNAUTHORIZED=false (kurang aman, pakai hanya jika terpaksa).
const useSsl = ["1", "true", "yes"].includes(
  String(process.env.DB_SSL || "").toLowerCase()
);

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  ssl: useSsl
    ? {
        minVersion: "TLSv1.2",
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
      }
    : undefined,
  waitForConnections: true,
  // Serverless membuka banyak instance sekaligus, jadi pool per instance dibuat kecil.
  connectionLimit: Number(
    process.env.DB_POOL_LIMIT || (process.env.VERCEL ? 3 : 10)
  ),
  queueLimit: 0,
  dateStrings: true,
  charset: "utf8mb4",
});

export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function withTransaction(work) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function checkConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query("SELECT 1");
  } finally {
    connection.release();
  }
}
