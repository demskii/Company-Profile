import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Nama file acak agar tidak bisa ditebak & tidak bentrok antar upload
    const ext = path.extname(file.originalname).toLowerCase()
    const randomName = crypto.randomBytes(16).toString('hex')
    cb(null, `${randomName}${ext}`)
  },
})

function fileFilter(req, file, cb) {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.'))
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // maksimal 5MB per gambar
})
