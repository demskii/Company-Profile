import { dbQuery } from '../config/db.js'

export async function getPublicContent(req, res) {
  try {
    const [rows] = await dbQuery(
      `SELECT section_key, title, body, image_url, updated_at
       FROM contents
       ORDER BY section_key ASC`
    )
    return res.json(rows)
  } catch (err) {
    console.error('Get public content error:', err.message)
    return res.status(500).json({ message: 'Gagal mengambil konten website.' })
  }
}
