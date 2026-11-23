import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { forbidden, unauthorized } from '../utils/helpers.js';

export const AUTH_COOKIE = 'alumindo_token';

export function signToken(admin) {
  return jwt.sign(
    { sub: String(admin.id), username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
  );
}

export function cookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  };
}

async function resolveAdmin(token) {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw unauthorized('Sesi Anda sudah berakhir. Silakan login kembali.');
  }
  const rows = await query(
    'SELECT id, username, email, name, last_login_at, created_at FROM admins WHERE id = ? LIMIT 1',
    [payload.sub],
  );
  if (rows.length === 0) throw unauthorized('Akun admin tidak ditemukan.');
  return rows[0];
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[AUTH_COOKIE];
    if (!token) throw unauthorized();
    req.admin = await resolveAdmin(token);
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return next();
  try {
    req.admin = await resolveAdmin(token);
  } catch {
    req.admin = null;
  }
  return next();
}

// Cookie auth needs a CSRF guard: mutating admin requests must carry this header.
export function requireCsrf(req, res, next) {
  if (req.get('x-requested-with') !== 'XMLHttpRequest') {
    return next(forbidden('Permintaan ditolak: header keamanan tidak valid.'));
  }
  return next();
}

export function isAdminRequest(req) {
  return Boolean(req.admin);
}
