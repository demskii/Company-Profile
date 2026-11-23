import { query } from '../config/db.js';

export async function logActivity(adminId, action, entityType, entityId, description) {
  try {
    await query(
      'INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
      [adminId ?? null, action, entityType, entityId ?? null, String(description).slice(0, 255)],
    );
  } catch (error) {
    console.error('[activity log]', error.message);
  }
}
