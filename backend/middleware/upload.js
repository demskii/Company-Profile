import multer from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const uploadDir = join(fileURLToPath(new URL('..', import.meta.url)), 'uploads');
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

const allowed = new Map([
  ['image/jpeg', ['.jpg', '.jpeg']],
  ['image/png', ['.png']],
  ['image/webp', ['.webp']],
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const allowedExt = allowed.get(file.mimetype);
    if (!allowedExt || !allowedExt.includes(ext)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Format file harus JPG, JPEG, PNG, atau WebP.'));
    }
    return cb(null, true);
  },
}).single('image');
