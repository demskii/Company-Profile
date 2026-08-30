import { Router } from 'express'
import { body } from 'express-validator'
import { login, refresh, updateContent, getAllContent } from '../controllers/admin.controller.js'
import { requireAuth, loginLimiter } from '../middleware/security.js'
import { handleValidation } from '../middleware/validate.js'

const router = Router()

router.post(
  '/login',
  loginLimiter,
  [body('username').trim().notEmpty(), body('password').notEmpty()],
  handleValidation,
  login
)

router.get('/content', requireAuth, getAllContent)

// Perpanjang sesi -- dipanggil berkala oleh frontend selagi admin aktif
// menggunakan dashboard. Butuh token yang MASIH valid untuk berhasil.
router.post('/refresh', requireAuth, refresh)

router.put(
  '/content',
  requireAuth,
  [
    body('section_key').trim().notEmpty().isLength({ max: 100 }),
    body('title').optional().trim().isLength({ max: 255 }),
    body('body').optional().trim(),
    body('image_url').optional({ checkFalsy: true }).trim().custom(value => /^https?:\/\/|^\/uploads\//i.test(value)).withMessage('URL gambar tidak valid.'),
  ],
  handleValidation,
  updateContent
)

export default router
