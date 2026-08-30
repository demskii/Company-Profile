import { validationResult } from 'express-validator'

// Menjalankan hasil validasi express-validator dan menghentikan request jika ada error
export function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Input tidak valid.', errors: errors.array() })
  }
  next()
}
