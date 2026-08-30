import { Router } from 'express'
import { body } from 'express-validator'
import { submitContact, listMessages } from '../controllers/contact.controller.js'
import { contactLimiter } from '../middleware/security.js'
import { handleValidation } from '../middleware/validate.js'
import { requireAuth } from '../middleware/security.js'

const router = Router()

// Validasi & sanitasi input form kontak
const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape().withMessage('Nama harus 2-100 karakter.'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Email tidak valid.'),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 20 }).escape(),
  body('message').trim().isLength({ min: 10, max: 2000 }).escape().withMessage('Pesan harus 10-2000 karakter.'),
]

router.post('/', contactLimiter, contactValidation, handleValidation, submitContact)

// Endpoint admin (terproteksi) untuk melihat daftar pesan masuk
router.get('/', requireAuth, listMessages)

export default router
