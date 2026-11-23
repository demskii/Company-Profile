import bcrypt from 'bcrypt';
import { pool, query } from '../config/db.js';

const [username, email, password, name = 'Administrator'] = process.argv.slice(2);

if (!username || !email || !password) {
  console.error('Usage: node database/create-admin.js <username> <email> <password> [name]');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password minimal 8 karakter.');
  process.exit(1);
}

try {
  const existing = await query('SELECT id FROM admins WHERE username = ? OR email = ?', [username, email]);
  if (existing.length > 0) {
    console.error('Username atau email sudah digunakan.');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  const result = await query(
    'INSERT INTO admins (username, email, password_hash, name) VALUES (?, ?, ?, ?)',
    [username, email.toLowerCase(), hash, name],
  );
  console.log(`Admin dibuat: ${username} (id ${result.insertId}).`);
} catch (error) {
  console.error('Gagal membuat admin:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
