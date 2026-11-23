import { query, withTransaction } from '../config/db.js';
import { badRequest, sendSuccess } from '../utils/helpers.js';
import { logActivity } from '../utils/activity.js';

const parseValue = (row) => {
  if (row.setting_type !== 'json') return row.setting_value ?? '';
  try {
    return JSON.parse(row.setting_value || '[]');
  } catch {
    return [];
  }
};

async function buildSettings() {
  const rows = await query('SELECT * FROM website_settings ORDER BY setting_group ASC, setting_key ASC');
  const settings = {};
  for (const row of rows) settings[row.setting_key] = parseValue(row);

  const imageIds = rows
    .filter((row) => row.setting_type === 'image' && row.setting_value)
    .map((row) => Number(row.setting_value))
    .filter((id) => Number.isInteger(id) && id > 0);

  const media = {};
  if (imageIds.length > 0) {
    const placeholders = imageIds.map(() => '?').join(',');
    const mediaRows = await query(`SELECT id, path, alt_text, title FROM media WHERE id IN (${placeholders})`, imageIds);
    const byId = new Map(mediaRows.map((row) => [row.id, { id: row.id, url: row.path, alt: row.alt_text, title: row.title }]));
    for (const row of rows) {
      if (row.setting_type === 'image' && row.setting_value) {
        media[row.setting_key] = byId.get(Number(row.setting_value)) || null;
      }
    }
  }

  return { settings, media, rows };
}

export async function getPublicSettings(req, res) {
  const { settings, media } = await buildSettings();
  return sendSuccess(res, { settings, media });
}

export async function getAllSettings(req, res) {
  const { settings, media, rows } = await buildSettings();
  return sendSuccess(res, {
    settings,
    media,
    groups: rows.map((row) => ({
      key: row.setting_key,
      group: row.setting_group,
      type: row.setting_type,
      updated_at: row.updated_at,
    })),
  });
}

export async function updateSettings(req, res) {
  const incoming = req.body?.settings;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    throw badRequest('Format pengaturan tidak valid.');
  }

  const rows = await query('SELECT setting_key, setting_type FROM website_settings');
  const known = new Map(rows.map((row) => [row.setting_key, row.setting_type]));
  const updates = [];

  for (const [key, value] of Object.entries(incoming)) {
    if (!known.has(key)) continue;
    const type = known.get(key);
    let stored;
    if (type === 'json') {
      if (typeof value !== 'object' || value === null) throw badRequest(`Nilai ${key} harus berupa JSON.`);
      stored = JSON.stringify(value);
    } else if (type === 'image') {
      if (value === '' || value === null || value === undefined) {
        stored = '';
      } else {
        const media = await query('SELECT id FROM media WHERE id = ?', [Number(value)]);
        if (media.length === 0) throw badRequest(`Gambar untuk ${key} tidak ditemukan.`);
        stored = String(Number(value));
      }
    } else {
      stored = String(value ?? '');
    }
    updates.push([key, stored]);
  }

  if (updates.length === 0) throw badRequest('Tidak ada pengaturan yang dikenali.');

  await withTransaction(async (db) => {
    for (const [key, value] of updates) {
      await db.execute('UPDATE website_settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
    }
  });

  await logActivity(req.admin.id, 'update', 'settings', null, `Memperbarui ${updates.length} pengaturan website`);
  const { settings, media } = await buildSettings();
  return sendSuccess(res, { settings, media });
}
