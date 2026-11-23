import { validationResult } from 'express-validator';
import { HttpError } from '../utils/helpers.js';

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((item) => ({
    field: item.path,
    message: item.msg,
  }));
  return next(new HttpError(422, 'Data yang dikirim belum valid.', errors));
}

export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'Ukuran file maksimal 5 MB.' });
  }
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Data dengan nilai unik tersebut sudah ada.' });
  }
  if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
    return res.status(409).json({ success: false, message: 'Data masih digunakan oleh data lain.' });
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ success: false, message: 'Referensi data tidak ditemukan.' });
  }

  const status = error.status || 500;
  if (status >= 500) {
    console.error('[server error]', error);
  }
  const body = {
    success: false,
    message: status >= 500 ? 'Terjadi kesalahan pada server.' : error.message,
  };
  if (error.details) body.errors = error.details;
  return res.status(status).json(body);
}
