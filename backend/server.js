import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { adminLimiter, publicReadLimiter } from './middleware/security.js'
import contactRoutes from './routes/contact.routes.js'
import adminRoutes from './routes/admin.routes.js'
import catalogRoutes from './routes/catalog.routes.js'
import adminCatalogRoutes from './routes/admin-catalog.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import contentRoutes from './routes/content.routes.js'
import { dbQuery } from './config/db.js'

dotenv.config()
const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// --- Keamanan dasar ---
// crossOriginResourcePolicy diatur agar gambar di /uploads tetap bisa
// dimuat oleh frontend yang berjalan di origin/port berbeda.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(express.json({ limit: '20kb' })) // batasi ukuran payload

// CORS hanya mengizinkan origin frontend yang terdaftar
const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map(o => o.trim())
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origin tidak diizinkan oleh kebijakan CORS.'))
    }
  },
  credentials: true,
}))

// Sajikan gambar yang sudah diunggah admin secara statis, mis:
// http://localhost:4000/uploads/namafile.jpg
// Diletakkan SEBELUM rate limiter supaya banyaknya gambar yang dimuat di
// halaman Produk/Portofolio tidak ikut menggerus jatah rate limit API.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rate limiting diterapkan TERPISAH per kelompok endpoint -- bukan satu
// limiter yang sama untuk seluruh /api -- supaya trafik wajar dashboard
// admin (yang sudah dilindungi login) tidak ikut menggerus jatah yang
// sama dengan trafik publik, dan sebaliknya.
app.get('/api/health', publicReadLimiter, (req, res) => res.json({ status: 'ok' }))

app.get('/api/health/db', publicReadLimiter, async (req, res) => {
  try {
    await dbQuery('SELECT 1 AS ok')
    return res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    console.error('Database health check error:', error.code || error.message)
    return res.status(503).json({ status: 'error', database: 'unavailable' })
  }
})
app.use('/api/contact', contactRoutes) // limiter POST-nya sendiri sudah di dalam route (contactLimiter)
app.use('/api/admin', adminLimiter, adminRoutes) // loginLimiter khusus /login ada di dalam admin.routes.js
app.use('/api/catalog', publicReadLimiter, catalogRoutes)
app.use('/api/content', publicReadLimiter, contentRoutes)
app.use('/api/admin/catalog', adminLimiter, adminCatalogRoutes)
app.use('/api/admin/upload', adminLimiter, uploadRoutes)

// --- 404 handler ---
app.use((req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan.' }))

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan pada server.' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`))
