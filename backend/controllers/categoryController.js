import { query, withTransaction } from '../config/db.js';
import {
  badRequest,
  notFound,
  parsePagination,
  paginationMeta,
  sendSuccess,
  uniqueSlug,
} from '../utils/helpers.js';
import { logActivity } from '../utils/activity.js';

const baseSelect = `
  SELECT c.*, m.path AS image_url, m.alt_text AS image_alt,
         (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
  FROM categories c
  LEFT JOIN media m ON m.id = c.image_id`;

const mapCategory = (row) => ({
  ...row,
  is_active: Boolean(row.is_active),
  product_count: Number(row.product_count || 0),
  image: row.image_url ? { url: row.image_url, alt: row.image_alt || row.name } : null,
});

export async function listCategories(req, res) {
  const includeAll = Boolean(req.admin) && String(req.query.status || '') === 'all';
  const search = String(req.query.search || '').trim();
  const where = [];
  const params = [];

  if (!includeAll) where.push('c.is_active = 1');
  if (search) {
    where.push('c.name LIKE ?');
    params.push(`%${search}%`);
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const { page, limit, offset } = parsePagination(req.query, 50);
  const [count] = await query(`SELECT COUNT(*) AS total FROM categories c ${clause}`, params);
  const rows = await query(
    `${baseSelect} ${clause} ORDER BY c.sort_order ASC, c.name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  return sendSuccess(res, rows.map(mapCategory), 200, paginationMeta(count.total, page, limit));
}

export async function getCategory(req, res) {
  const rows = await query(`${baseSelect} WHERE c.slug = ? LIMIT 1`, [req.params.slug]);
  if (rows.length === 0) throw notFound('Kategori tidak ditemukan.');
  if (!rows[0].is_active && !req.admin) throw notFound('Kategori tidak ditemukan.');
  return sendSuccess(res, mapCategory(rows[0]));
}

export async function createCategory(req, res) {
  const name = String(req.body.name || '').trim();
  if (!name) throw badRequest('Nama kategori wajib diisi.');

  const category = await withTransaction(async (db) => {
    const slug = await uniqueSlug(db, 'categories', req.body.slug || name);
    const [result] = await db.execute(
      `INSERT INTO categories (name, slug, description, image_id, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        req.body.description || null,
        req.body.image_id || null,
        req.body.is_active === false || req.body.is_active === '0' ? 0 : 1,
        Number(req.body.sort_order) || 0,
      ],
    );
    return { id: result.insertId, slug };
  });

  await logActivity(req.admin.id, 'create', 'category', category.id, `Menambah kategori "${name}"`);
  const [row] = await query(`${baseSelect} WHERE c.id = ?`, [category.id]);
  return sendSuccess(res, mapCategory(row), 201);
}

export async function updateCategory(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT * FROM categories WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Kategori tidak ditemukan.');
  const existing = rows[0];

  const name = String(req.body.name ?? existing.name).trim();
  if (!name) throw badRequest('Nama kategori wajib diisi.');

  await withTransaction(async (db) => {
    const slug = await uniqueSlug(db, 'categories', req.body.slug || (name !== existing.name ? name : existing.slug), id);
    await db.execute(
      `UPDATE categories SET name = ?, slug = ?, description = ?, image_id = ?, is_active = ?, sort_order = ?
       WHERE id = ?`,
      [
        name,
        slug,
        req.body.description ?? existing.description,
        req.body.image_id === undefined ? existing.image_id : req.body.image_id || null,
        req.body.is_active === undefined
          ? existing.is_active
          : req.body.is_active === false || req.body.is_active === '0'
            ? 0
            : 1,
        Number(req.body.sort_order ?? existing.sort_order) || 0,
        id,
      ],
    );
  });

  await logActivity(req.admin.id, 'update', 'category', id, `Memperbarui kategori "${name}"`);
  const [row] = await query(`${baseSelect} WHERE c.id = ?`, [id]);
  return sendSuccess(res, mapCategory(row));
}

export async function deleteCategory(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT name FROM categories WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Kategori tidak ditemukan.');

  const [count] = await query('SELECT COUNT(*) AS total FROM products WHERE category_id = ?', [id]);
  if (count.total > 0) {
    return res.status(409).json({
      success: false,
      message: `Kategori masih memiliki ${count.total} produk. Pindahkan atau hapus produk tersebut terlebih dahulu.`,
      usage: { products: count.total },
    });
  }

  await query('DELETE FROM categories WHERE id = ?', [id]);
  await logActivity(req.admin.id, 'delete', 'category', id, `Menghapus kategori "${rows[0].name}"`);
  return sendSuccess(res, { id });
}
