import { query } from '../config/db.js';
import {
  badRequest,
  notFound,
  parsePagination,
  paginationMeta,
  sendSuccess,
} from '../utils/helpers.js';
import { logActivity } from '../utils/activity.js';

export async function createMessage(req, res) {
  // Honeypot field: real users never fill this hidden input.
  if (String(req.body.website || '').trim() !== '') {
    throw badRequest('Pesan tidak dapat dikirim.');
  }

  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const phone = String(req.body.phone || '').trim();
  const message = String(req.body.message || '').trim();
  if (!name || !email || !phone || !message) throw badRequest('Semua kolom formulir wajib diisi.');

  const result = await query(
    'INSERT INTO contact_messages (name, email, phone, message, status, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, message, 'unread', req.ip?.slice(0, 45) || null],
  );
  return sendSuccess(
    res,
    { id: result.insertId, message: 'Pesan Anda sudah terkirim. Tim kami akan menghubungi Anda.' },
    201,
  );
}

export async function listMessages(req, res) {
  const { page, limit, offset } = parsePagination(req.query, 10);
  const search = String(req.query.search || '').trim();
  const status = String(req.query.status || '').trim();
  const where = [];
  const params = [];

  if (status && ['unread', 'read', 'replied'].includes(status)) {
    where.push('status = ?');
    params.push(status);
  }
  if (search) {
    where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [count] = await query(`SELECT COUNT(*) AS total FROM contact_messages ${clause}`, params);
  const rows = await query(
    `SELECT * FROM contact_messages ${clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  return sendSuccess(res, rows, 200, paginationMeta(count.total, page, limit));
}

export async function getMessage(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT * FROM contact_messages WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Pesan tidak ditemukan.');
  if (rows[0].status === 'unread') {
    await query("UPDATE contact_messages SET status = 'read' WHERE id = ?", [id]);
    rows[0].status = 'read';
  }
  return sendSuccess(res, rows[0]);
}

export async function updateMessage(req, res) {
  const id = Number(req.params.id);
  const status = String(req.body.status || '').trim();
  if (!['unread', 'read', 'replied'].includes(status)) throw badRequest('Status pesan tidak valid.');

  const rows = await query('SELECT id FROM contact_messages WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Pesan tidak ditemukan.');

  await query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
  await logActivity(req.admin.id, 'update', 'message', id, `Mengubah status pesan menjadi ${status}`);
  const [row] = await query('SELECT * FROM contact_messages WHERE id = ?', [id]);
  return sendSuccess(res, row);
}

export async function deleteMessage(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT name FROM contact_messages WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Pesan tidak ditemukan.');
  await query('DELETE FROM contact_messages WHERE id = ?', [id]);
  await logActivity(req.admin.id, 'delete', 'message', id, `Menghapus pesan dari "${rows[0].name}"`);
  return sendSuccess(res, { id });
}
