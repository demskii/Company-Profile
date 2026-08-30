import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { dbQuery } from '../config/db.js'

export async function login(req, res) {
  const { username, password } = req.body
  try {
    const [rows] = await dbQuery('SELECT * FROM admins WHERE username = ? LIMIT 1', [username])
    const admin = rows[0]
    if (!admin) return res.status(401).json({ message: 'Username atau password salah.' })

    const isValid = await bcrypt.compare(password, admin.password_hash)
    if (!isValid) return res.status(401).json({ message: 'Username atau password salah.' })

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    })
    return res.json({ token })
  } catch (err) {
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' })
  }
}

// Menerbitkan token baru selama token lama yang dikirim masih valid.
// Dipanggil otomatis oleh frontend secara berkala agar sesi admin tidak
// terputus selama tab dashboard tetap dibuka ("sliding session") --
// admin tidak perlu login ulang hanya karena meninggalkan tab dalam
// keadaan idle.
export function refresh(req, res) {
  // req.admin sudah diisi oleh middleware requireAuth setelah verifikasi berhasil
  const token = jwt.sign({ id: req.admin.id, username: req.admin.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  })
  return res.json({ token })
}

// Contoh endpoint CMS: update konten per-section (mis. teks hero, deskripsi tentang kami)
export async function updateContent(req, res) {
  const { section_key, title, body, image_url } = req.body
  try {
    await dbQuery(
      `INSERT INTO contents (section_key, title, body, image_url)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), image_url = VALUES(image_url)`,
      [section_key, title, body, image_url]
    )
    return res.json({ message: 'Konten berhasil diperbarui.' })
  } catch (err) {
    return res.status(500).json({ message: 'Gagal memperbarui konten.' })
  }
}

export async function getAllContent(req, res) {
  try {
    const [rows] = await dbQuery('SELECT * FROM contents')
    return res.json(rows)
  } catch (err) {
    return res.status(500).json({ message: 'Gagal mengambil konten.' })
  }
}
