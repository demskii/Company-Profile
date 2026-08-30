// Script bantu membuat akun admin pertama.
// Jalankan dari folder backend: node scripts/create-admin.js <username> <password>
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { pool } from '../config/db.js'

dotenv.config()

const [, , username, password] = process.argv

if (!username || !password) {
  console.error('Pemakaian: node scripts/create-admin.js <username> <password>')
  process.exit(1)
}

if (password.length < 8) {
  console.error('Password minimal 8 karakter.')
  process.exit(1)
}

try {
  const hash = await bcrypt.hash(password, 10)
  await pool.query(
    `INSERT INTO admins (username, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [username, hash]
  )
  console.log(`Akun admin "${username}" berhasil dibuat/diperbarui.`)
} catch (err) {
  console.error('Gagal membuat akun admin:', err.message)
} finally {
  await pool.end()
}
