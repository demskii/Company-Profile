import { query } from '../config/db.js';
import { sendSuccess } from '../utils/helpers.js';

async function scalar(sql, params = []) {
  const [row] = await query(sql, params);
  return Number(row.total || 0);
}

export async function dashboardStats(req, res) {
  const [products, categories, services, media, messages, unread] = await Promise.all([
    scalar('SELECT COUNT(*) AS total FROM products'),
    scalar('SELECT COUNT(*) AS total FROM categories'),
    scalar('SELECT COUNT(*) AS total FROM services'),
    scalar('SELECT COUNT(*) AS total FROM media'),
    scalar('SELECT COUNT(*) AS total FROM contact_messages'),
    scalar("SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'unread'"),
  ]);

  const categoryBreakdown = await query(
    `SELECT c.name, COUNT(p.id) AS total
     FROM categories c LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id, c.name ORDER BY c.sort_order ASC`,
  );

  const recentMessages = await query(
    'SELECT id, name, email, status, created_at FROM contact_messages ORDER BY created_at DESC, id DESC LIMIT 5',
  );

  return sendSuccess(res, {
    counts: { products, categories, services, media, messages, unread },
    categoryBreakdown: categoryBreakdown.map((row) => ({ name: row.name, total: Number(row.total) })),
    recentMessages,
  });
}

export async function activityList(req, res) {
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
  const rows = await query(
    `SELECT a.id, a.action, a.entity_type, a.entity_id, a.description, a.created_at,
            ad.username AS admin_username, ad.name AS admin_name
     FROM activity_logs a
     LEFT JOIN admins ad ON ad.id = a.admin_id
     ORDER BY a.created_at DESC, a.id DESC
     LIMIT ?`,
    [limit],
  );
  return sendSuccess(res, rows);
}
