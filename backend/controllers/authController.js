import bcrypt from 'bcrypt';
import { query } from '../config/db.js';
import { AUTH_COOKIE, cookieOptions, signToken } from '../middleware/auth.js';
import { badRequest, notFound, sendSuccess, unauthorized } from '../utils/helpers.js';
import { logActivity } from '../utils/activity.js';

const publicAdmin = (admin) => ({
  id: admin.id,
  username: admin.username,
  email: admin.email,
  name: admin.name,
  last_login_at: admin.last_login_at,
  created_at: admin.created_at,
});

export async function login(req, res) {
  const identifier = String(req.body.identifier || '').trim();
  const password = String(req.body.password || '');

  const rows = await query(
    'SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1',
    [identifier, identifier],
  );
  const admin = rows[0];
  const hash = admin?.password_hash || '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin';
  const valid = await bcrypt.compare(password, hash);

  if (!admin || !valid) {
    throw unauthorized('Username/email atau password salah.');
  }

  await query('UPDATE admins SET last_login_at = NOW() WHERE id = ?', [admin.id]);
  res.cookie(AUTH_COOKIE, signToken(admin), cookieOptions());
  await logActivity(admin.id, 'login', 'auth', admin.id, `${admin.username} masuk ke dashboard`);
  return sendSuccess(res, publicAdmin({ ...admin, last_login_at: new Date().toISOString() }));
}

export async function logout(req, res) {
  if (req.admin) {
    await logActivity(req.admin.id, 'logout', 'auth', req.admin.id, `${req.admin.username} keluar dari dashboard`);
  }
  res.clearCookie(AUTH_COOKIE, { ...cookieOptions(), maxAge: undefined });
  return sendSuccess(res, { message: 'Logout berhasil.' });
}

export async function me(req, res) {
  if (!req.admin) return sendSuccess(res, null);
  return sendSuccess(res, publicAdmin(req.admin));
}

export async function updateProfile(req, res) {
  const admin = req.admin;
  const name = String(req.body.name || '').trim();
  const username = String(req.body.username || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const currentPassword = String(req.body.current_password || '');
  const newPassword = String(req.body.new_password || '');

  if (!name || !username || !email) throw badRequest('Nama, username, dan email wajib diisi.');

  const rows = await query('SELECT * FROM admins WHERE id = ?', [admin.id]);
  if (rows.length === 0) throw notFound('Akun admin tidak ditemukan.');
  const record = rows[0];

  const duplicate = await query(
    'SELECT id FROM admins WHERE (username = ? OR email = ?) AND id <> ? LIMIT 1',
    [username, email, admin.id],
  );
  if (duplicate.length > 0) throw badRequest('Username atau email sudah digunakan akun lain.');

  let passwordHash = record.password_hash;
  if (newPassword) {
    if (newPassword.length < 8) throw badRequest('Password baru minimal 8 karakter.');
    const valid = await bcrypt.compare(currentPassword, record.password_hash);
    if (!valid) throw badRequest('Password saat ini tidak sesuai.');
    passwordHash = await bcrypt.hash(newPassword, 12);
  }

  await query(
    'UPDATE admins SET name = ?, username = ?, email = ?, password_hash = ? WHERE id = ?',
    [name, username, email, passwordHash, admin.id],
  );
  await logActivity(admin.id, 'update', 'account', admin.id, 'Memperbarui profil akun admin');

  const [updated] = await query(
    'SELECT id, username, email, name, last_login_at, created_at FROM admins WHERE id = ?',
    [admin.id],
  );
  if (newPassword) {
    res.cookie(AUTH_COOKIE, signToken(updated), cookieOptions());
  }
  return sendSuccess(res, publicAdmin(updated));
}
