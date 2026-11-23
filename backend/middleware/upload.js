import multer from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const uploadDir = join(fileURLToPath(new URL('..', import.meta.url)), 'uploads');

// Vercel membatasi body request fungsi 4,5 MB, jadi batas upload dibuat 4 MB di semua mode.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// Di Vercel, filesystem hanya-baca dan tidak permanen, jadi gambar disimpan di Vercel Blob.
// Blob aktif otomatis jika store sudah dihubungkan ke project (BLOB_STORE_ID) atau token diisi.
// Tanpa itu (mode lokal/XAMPP), gambar disimpan di folder backend/uploads seperti sebelumnya.
export const isBlobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

if (!isBlobEnabled()) {
  try {
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
  } catch (error) {
    console.warn('[upload] folder uploads tidak bisa dibuat:', error.message);
  }
}

const allowed = new Map([
  ['image/jpeg', ['.jpg', '.jpeg']],
  ['image/png', ['.png']],
  ['image/webp', ['.webp']],
]);

// File ditahan di memori (maks 4 MB) lalu ditulis oleh controller ke disk atau Blob.
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const allowedExt = allowed.get(file.mimetype);
    if (!allowedExt || !allowedExt.includes(ext)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Format file harus JPG, JPEG, PNG, atau WebP.'));
    }
    return cb(null, true);
  },
}).single('image');
