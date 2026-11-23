export class HttpError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details);
export const unauthorized = (message = 'Anda harus login terlebih dahulu.') => new HttpError(401, message);
export const forbidden = (message = 'Anda tidak memiliki akses.') => new HttpError(403, message);
export const notFound = (message = 'Data tidak ditemukan.') => new HttpError(404, message);
export const conflict = (message, details) => new HttpError(409, message, details);

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function sendSuccess(res, data = null, status = 200, meta = null) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

export function parsePagination(query, defaultLimit = 9) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, offset: (page - 1) * limit };
}

export function paginationMeta(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 190);
}

export async function uniqueSlug(db, table, base, excludeId = null) {
  const allowed = ['products', 'categories'];
  if (!allowed.includes(table)) throw new Error('Tabel slug tidak didukung.');
  let slug = slugify(base) || 'item';
  let suffix = 1;
  for (;;) {
    const params = [slug];
    let sql = `SELECT id FROM ${table} WHERE slug = ?`;
    if (excludeId) {
      sql += ' AND id <> ?';
      params.push(excludeId);
    }
    const [rows] = await db.execute(sql, params);
    if (rows.length === 0) return slug;
    suffix += 1;
    slug = `${slugify(base).slice(0, 180)}-${suffix}`;
  }
}

export function parseJsonArray(value, fallback = []) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
