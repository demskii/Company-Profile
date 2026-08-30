import rateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'

// Rate limiter khusus endpoint publik (mis. form kontak) -- anti-spam & brute force
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // maksimal 5 request per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
})

// Rate limiter untuk endpoint PUBLIK read-only (/api/catalog, /api/content,
// /api/health). Cukup longgar karena risikonya rendah (cuma SELECT data),
// tapi tetap ada sebagai pengaman dari scraping/bot berlebihan.
export const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan dari perangkat ini. Coba lagi dalam beberapa menit.' },
})

// Rate limiter KHUSUS percobaan login admin -- ini yang penting dibatasi
// ketat untuk mencegah brute-force password, karena login tidak butuh
// token untuk diakses (beda dengan endpoint /api/admin/* lainnya yang
// sudah otomatis terlindungi requireAuth).
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 percobaan login per 15 menit per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.' },
})

// Rate limiter untuk endpoint admin YANG SUDAH login (JWT valid). Dibuat
// sangat longgar -- fungsinya cuma jaring pengaman terhadap bug/loop yang
// tidak sengaja memicu request beruntun, BUKAN untuk membatasi pemakaian
// wajar admin (buka banyak menu, edit produk, upload gambar berkali-kali
// dalam satu sesi kerja sama sekali tidak seharusnya kena limit).
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan dalam waktu singkat. Coba lagi sesaat lagi.' },
})

// Middleware autentikasi admin berbasis JWT
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Tidak terautentikasi.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' })
  }
}
