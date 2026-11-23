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
  SELECT p.id, p.category_id, p.name, p.slug, p.short_description, p.description,
         p.specifications, p.image_id, p.is_published, p.is_featured, p.sort_order,
         p.created_at, p.updated_at,
         c.name AS category_name, c.slug AS category_slug,
         m.path AS image_url, m.alt_text AS image_alt
  FROM products p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN media m ON m.id = p.image_id`;

const mapProduct = (row) => ({
  ...row,
  is_published: Boolean(row.is_published),
  is_featured: Boolean(row.is_featured),
  image: row.image_url ? { url: row.image_url, alt: row.image_alt || row.name } : null,
  category: { id: row.category_id, name: row.category_name, slug: row.category_slug },
});

export async function listProducts(req, res) {
  const { page, limit, offset } = parsePagination(req.query, 9);
  const search = String(req.query.search || '').trim();
  const category = String(req.query.category || '').trim();
  const featured = String(req.query.featured || '').trim();
  const includeAll = Boolean(req.admin) && String(req.query.status || '') === 'all';
  const where = [];
  const params = [];

  if (!includeAll) where.push('p.is_published = 1');
  if (search) {
    where.push('(p.name LIKE ? OR p.short_description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    where.push('c.slug = ?');
    params.push(category);
  }
  if (featured === '1') where.push('p.is_featured = 1');

  const sortMap = {
    newest: 'p.created_at DESC, p.id DESC',
    oldest: 'p.created_at ASC, p.id ASC',
    name: 'p.name ASC',
    order: 'p.sort_order ASC, p.id DESC',
  };
  const orderBy = sortMap[String(req.query.sort || 'order')] || sortMap.order;
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [count] = await query(
    `SELECT COUNT(*) AS total FROM products p JOIN categories c ON c.id = p.category_id ${clause}`,
    params,
  );
  const rows = await query(`${baseSelect} ${clause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [
    ...params,
    limit,
    offset,
  ]);

  return sendSuccess(res, rows.map(mapProduct), 200, paginationMeta(count.total, page, limit));
}

export async function getProduct(req, res) {
  const rows = await query(`${baseSelect} WHERE p.slug = ? LIMIT 1`, [req.params.slug]);
  if (rows.length === 0) throw notFound('Produk tidak ditemukan.');
  if (!rows[0].is_published && !req.admin) throw notFound('Produk tidak ditemukan.');
  return sendSuccess(res, mapProduct(rows[0]));
}

export async function getProductById(req, res) {
  const rows = await query(`${baseSelect} WHERE p.id = ? LIMIT 1`, [req.params.id]);
  if (rows.length === 0) throw notFound('Produk tidak ditemukan.');
  return sendSuccess(res, mapProduct(rows[0]));
}

async function ensureCategory(categoryId) {
  const rows = await query('SELECT id FROM categories WHERE id = ?', [categoryId]);
  if (rows.length === 0) throw badRequest('Kategori produk tidak ditemukan.');
}

async function ensureMedia(imageId) {
  if (!imageId) return null;
  const rows = await query('SELECT id FROM media WHERE id = ?', [imageId]);
  if (rows.length === 0) throw badRequest('Gambar yang dipilih tidak ditemukan.');
  return imageId;
}

export async function createProduct(req, res) {
  const { name, category_id, short_description, description, specifications, image_id } = req.body;
  await ensureCategory(category_id);
  const mediaId = await ensureMedia(image_id);

  const product = await withTransaction(async (db) => {
    const slug = await uniqueSlug(db, 'products', req.body.slug || name);
    const [result] = await db.execute(
      `INSERT INTO products
        (category_id, name, slug, short_description, description, specifications, image_id, is_published, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        String(name).trim(),
        slug,
        short_description || null,
        description || null,
        specifications || null,
        mediaId,
        req.body.is_published === false || req.body.is_published === '0' ? 0 : 1,
        req.body.is_featured ? 1 : 0,
        Number(req.body.sort_order) || 0,
      ],
    );
    return { id: result.insertId, slug };
  });

  await logActivity(req.admin.id, 'create', 'product', product.id, `Menambah produk "${name}"`);
  const rows = await query(`${baseSelect} WHERE p.id = ?`, [product.id]);
  return sendSuccess(res, mapProduct(rows[0]), 201);
}

export async function updateProduct(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT * FROM products WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Produk tidak ditemukan.');
  const existing = rows[0];

  const categoryId = Number(req.body.category_id ?? existing.category_id);
  await ensureCategory(categoryId);
  const mediaId = await ensureMedia(
    req.body.image_id === undefined ? existing.image_id : req.body.image_id || null,
  );
  const name = String(req.body.name ?? existing.name).trim();
  if (!name) throw badRequest('Nama produk wajib diisi.');

  const updated = await withTransaction(async (db) => {
    const slugSource = req.body.slug || (name !== existing.name ? name : existing.slug);
    const slug = await uniqueSlug(db, 'products', slugSource, id);
    await db.execute(
      `UPDATE products SET category_id = ?, name = ?, slug = ?, short_description = ?, description = ?,
        specifications = ?, image_id = ?, is_published = ?, is_featured = ?, sort_order = ?
       WHERE id = ?`,
      [
        categoryId,
        name,
        slug,
        req.body.short_description ?? existing.short_description,
        req.body.description ?? existing.description,
        req.body.specifications ?? existing.specifications,
        mediaId,
        req.body.is_published === undefined
          ? existing.is_published
          : req.body.is_published === false || req.body.is_published === '0'
            ? 0
            : 1,
        req.body.is_featured === undefined ? existing.is_featured : req.body.is_featured ? 1 : 0,
        Number(req.body.sort_order ?? existing.sort_order) || 0,
        id,
      ],
    );
    return { id, slug };
  });

  await logActivity(req.admin.id, 'update', 'product', id, `Memperbarui produk "${name}"`);
  const [row] = await query(`${baseSelect} WHERE p.id = ?`, [updated.id]);
  return sendSuccess(res, mapProduct(row));
}

export async function deleteProduct(req, res) {
  const id = Number(req.params.id);
  const rows = await query('SELECT name FROM products WHERE id = ?', [id]);
  if (rows.length === 0) throw notFound('Produk tidak ditemukan.');
  await query('DELETE FROM products WHERE id = ?', [id]);
  await logActivity(req.admin.id, 'delete', 'product', id, `Menghapus produk "${rows[0].name}"`);
  return sendSuccess(res, { id });
}
