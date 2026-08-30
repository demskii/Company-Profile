import { Router } from 'express'
import { upload } from '../middleware/upload.js'
import { handleUpload } from '../controllers/upload.controller.js'
import { requireAuth } from '../middleware/security.js'

const router = Router()

// Hanya admin yang sudah login yang boleh upload gambar
router.post('/', requireAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message })
    handleUpload(req, res)
  })
})

export default router
