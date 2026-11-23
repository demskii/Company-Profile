import { query } from '../config/db.js';
import { badRequest, notFound, sendSuccess } from '../utils/helpers.js';
import { logActivity } from '../utils/activity.js';

const baseSelect = `
  SELECT s.*, m.path AS image_url, m.alt_text AS image_alt
  FROM services s
  LEFT JOIN media m ON m.id = s.image_id`;

const mapService = (row) => ({
  ...row,
  is_published: Boolean(row.is_published),
  image: row.image_url ? { url: row.image_url, alt: row.image_alt || row.title } : null,
});

export async function listServices(req, res) {
  const includeAll = Boolean(req.admin) && String(req.query.status || '') === 'all';
  const where = includeAll ? '' : 'WHERE s.is_published = 1';
  const rows = await query(`${baseSelect} ${where} ORDER BY s.sort_order ASC, s.id ASC`);
  return sendSuccess(res, rows.map(mapService));
}

export async function getService(req, res) {
  const rows = await query(`${baseSelect} WHERE s.id = ? LIMIT 1`, [req.params.id]);
  if (rows.length === 0) throw notFound('Layanan tidak ditemukan.');
  if (!rows[0].is_published && !req.admin) throw notFound('Layanan tidak ditemukan.');
  return sendSuccess(res, mapService(rows[0]));
}

export async function createService(req, res) {
  const title = String(req.body.title || '').trim();
  if (!title) throw badRequest('Judul layanan wajib diisi.');
  if (req.body.image_id) {
    const media = await query('SELECT id FROM media WHERE id = ?', [req.body.image_id]);
    if (media.length === 0) throw badRequest('Gambar yang dipilih tidak ditemukan.');
  }

  const result = await query(
    `INSERT INTO services (title, description, detail, image_id, is_published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      title,
      req.body.description || null,
      req.body.detail || null,
      req.body.image_id || null,
      req.body.is_published === false || req.body.is_published === '0' ? 0 : 1,
      Number(req.body.sort_order) || 0,
    ],
  );

  await logActivity(req.admin.id, 'create', 'service', result.insertId, `Menambah layanan "${title}"`);
  const [row] = await query(`${baseSelect} WHERE s.id = ?`, [result.insertId]);
  return sendSuccess(res, mapService(row), 201);
}

export async function updateService(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT * FROM services WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Layanan tidak ditemukan.');
  const existing = rows[0];
  const title = String(req.body.title ?? existing.title).trim();
  if (!title) throw badRequest('Judul layanan wajib diisi.');

  await query(
    `UPDATE services SET title = ?, description = ?, detail = ?, image_id = ?, is_published = ?, sort_order = ?
     WHERE id = ?`,
    [
      title,
      req.body.description ?? existing.description,
      req.body.detail ?? existing.detail,
      req.body.image_id === undefined ? existing.image_id : req.body.image_id || null,
      req.body.is_published === undefined
        ? existing.is_published
        : req.body.is_published === false || req.body.is_published === '0'
          ? 0
          : 1,
      Number(req.body.sort_order ?? existing.sort_order) || 0,
      id,
    ],
  );

  await logActivity(req.admin.id, 'update', 'service', id, `Memperbarui layanan "${title}"`);
  const [row] = await query(`${baseSelect} WHERE s.id = ?`, [id]);
  return sendSuccess(res, mapService(row));
}

export async function deleteService(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT title FROM services WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Layanan tidak ditemukan.');
  await query('DELETE FROM services WHERE id = ?', [id]);
  await logActivity(req.admin.id, 'delete', 'service', id, `Menghapus layanan "${rows[0].title}"`);
  return sendSuccess(res, { id });
}
