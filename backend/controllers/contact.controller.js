import { dbQuery } from '../config/db.js'
import { sendContactNotification } from '../utils/mailer.js'

export async function submitContact(req, res) {
  const { name, email, phone, message } = req.body
  try {
    // Simpan pesan ke database menggunakan prepared statement (aman dari SQL Injection)
    await dbQuery(
      'INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, message]
    )

    // Kirim notifikasi email ke admin (tidak menghentikan response jika gagal)
    sendContactNotification({ name, email, phone, message }).catch(err =>
      console.error('Gagal mengirim email notifikasi:', err.message)
    )

    return res.status(201).json({ message: 'Pesan berhasil dikirim.' })
  } catch (err) {
    console.error('Contact submission error:', err.message)
    return res.status(500).json({ message: 'Terjadi kesalahan pada server. Coba lagi nanti.' })
  }
}

export async function listMessages(req, res) {
  try {
    const [rows] = await dbQuery('SELECT * FROM messages ORDER BY created_at DESC LIMIT 200')
    return res.json(rows)
  } catch (err) {
    return res.status(500).json({ message: 'Gagal mengambil data pesan.' })
  }
}
