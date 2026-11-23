import { unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { query } from '../config/db.js';
import { isBlobEnabled, uploadDir } from '../middleware/upload.js';
import { badRequest, notFound, parsePagination, paginationMeta, sendSuccess } from '../utils/helpers.js';

const SIGNATURES = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] },
];

// Validasi magic byte langsung dari buffer upload (file belum disimpan ke mana pun).
function matchesSignature(buffer, mime) {
  const rule = SIGNATURES.find((item) => item.mime === mime);
  if (!rule || buffer.length < 12) return false;
  const headerOk = rule.bytes.every((byte, index) => buffer[index] === byte);
  if (mime === 'image/webp') {
    return headerOk && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  return headerOk;
}

// Simpan gambar: ke Vercel Blob jika aktif (kembalian berupa URL https penuh),
// atau ke folder backend/uploads untuk mode lokal (kembalian berupa /uploads/<nama>).
async function storeImage(file) {
  const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${extname(file.originalname).toLowerCase()}`;
  if (isBlobEnabled()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`media/${filename}`, new Blob([file.buffer], { type: file.mimetype }), {
      access: 'public',
      contentType: file.mimetype,
    });
    return { filename, publicPath: blob.url };
  }
  await writeFile(join(uploadDir, filename), file.buffer);
  return { filename, publicPath: `/uploads/${filename}` };
}

async function removeStoredImage(publicPath) {
  if (/^https?:\/\//.test(publicPath)) {
    if (!isBlobEnabled()) return;
    const { del } = await import('@vercel/blob');
    await del(publicPath).catch((error) => console.warn('[media] gagal hapus blob:', error.message));
    return;
  }
  if (publicPath.startsWith('/uploads/')) {
    const filename = publicPath.replace('/uploads/', '');
    if (!filename.includes('..') && !filename.includes('/')) {
      await unlink(join(uploadDir, filename)).catch(() => {});
    }
  }
}

function mediaResponse(row) {
  return {
    id: row.id,
    filename: row.filename,
    original_name: row.original_name,
    url: row.path,
    mime_type: row.mime_type,
    size_bytes: row.size_bytes,
    title: row.title,
    alt_text: row.alt_text,
    created_at: row.created_at,
  };
}

export async function listMedia(req, res) {
  const { page, limit, offset } = parsePagination(req.query, 12);
  const search = String(req.query.search || '').trim();
  const type = String(req.query.type || '').trim();
  const where = [];
  const params = [];

  if (search) {
    where.push('(title LIKE ? OR original_name LIKE ? OR alt_text LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (type === 'image') where.push("mime_type LIKE 'image/%'");

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [count] = await query(`SELECT COUNT(*) AS total FROM media ${clause}`, params);
  const rows = await query(
    `SELECT * FROM media ${clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return sendSuccess(res, rows.map(mediaResponse), 200, paginationMeta(count.total, page, limit));
}

export async function uploadMedia(req, res) {
  if (!req.file) throw badRequest('File gambar wajib diunggah.');
  if (!matchesSignature(req.file.buffer, req.file.mimetype)) {
    throw badRequest('Isi file tidak sesuai dengan format gambar yang diizinkan.');
  }
  const { filename, publicPath } = await storeImage(req.file);

  const title = String(req.body.title || req.file.originalname.replace(/\.[^.]+$/, '')).slice(0, 160);
  const altText = String(req.body.alt_text || title).slice(0, 255);
  const result = await query(
    'INSERT INTO media (filename, original_name, path, mime_type, size_bytes, title, alt_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      filename,
      req.file.originalname.slice(0, 255),
      publicPath,
      req.file.mimetype,
      req.file.size,
      title,
      altText,
    ],
  ).catch(async (error) => {
    // Jangan tinggalkan file yatim jika insert ke database gagal.
    await removeStoredImage(publicPath);
    throw error;
  });
  const [row] = await query('SELECT * FROM media WHERE id = ?', [result.insertId]);
  return sendSuccess(res, mediaResponse(row), 201);
}

export async function updateMedia(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT * FROM media WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Media tidak ditemukan.');

  const title = String(req.body.title ?? rows[0].title).trim().slice(0, 160);
  const altText = String(req.body.alt_text ?? rows[0].alt_text).trim().slice(0, 255);
  if (!title) throw badRequest('Nama gambar wajib diisi.');

  await query('UPDATE media SET title = ?, alt_text = ? WHERE id = ?', [title, altText, id]);
  const [row] = await query('SELECT * FROM media WHERE id = ?', [id]);
  return sendSuccess(res, mediaResponse(row));
}

async function mediaUsage(id) {
  const [products] = await query('SELECT COUNT(*) AS total FROM products WHERE image_id = ?', [id]);
  const [categories] = await query('SELECT COUNT(*) AS total FROM categories WHERE image_id = ?', [id]);
  const [services] = await query('SELECT COUNT(*) AS total FROM services WHERE image_id = ?', [id]);
  const [settings] = await query(
    "SELECT COUNT(*) AS total FROM website_settings WHERE setting_type = 'image' AND setting_value = ?",
    [String(id)],
  );
  return {
    products: products.total,
    categories: categories.total,
    services: services.total,
    settings: settings.total,
  };
}

export async function deleteMedia(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT * FROM media WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Media tidak ditemukan.');

  const usage = await mediaUsage(id);
  const total = Object.values(usage).reduce((sum, value) => sum + value, 0);
  if (total > 0) {
    const labels = [];
    if (usage.products) labels.push(`${usage.products} produk`);
    if (usage.categories) labels.push(`${usage.categories} kategori`);
    if (usage.services) labels.push(`${usage.services} layanan`);
    if (usage.settings) labels.push(`${usage.settings} pengaturan website`);
    return res.status(409).json({
      success: false,
      message: `Gambar masih digunakan oleh ${labels.join(', ')}. Lepaskan referensinya terlebih dahulu.`,
      usage,
    });
  }

  await query('DELETE FROM media WHERE id = ?', [id]);
  await removeStoredImage(rows[0].path);
  return sendSuccess(res, { id });
}
