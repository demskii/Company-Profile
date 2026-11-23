import { body, param } from 'express-validator';

const idParam = (name = 'id') => param(name).isInt({ min: 1 }).withMessage('ID tidak valid.');

const booleanish = (field) =>
  body(field).optional().custom((value) => [true, false, 0, 1, '0', '1'].includes(value)).withMessage(`${field} harus boolean.`);

export const loginRules = [
  body('identifier').trim().notEmpty().withMessage('Username atau email wajib diisi.'),
  body('password').isString().notEmpty().withMessage('Password wajib diisi.'),
];

export const profileRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nama 2-120 karakter.'),
  body('username').trim().isLength({ min: 3, max: 60 }).matches(/^[a-zA-Z0-9._-]+$/).withMessage('Username hanya huruf, angka, titik, garis bawah, atau strip.'),
  body('email').trim().isEmail().withMessage('Email tidak valid.').isLength({ max: 160 }),
  body('new_password').optional({ values: 'falsy' }).isLength({ min: 8, max: 72 }).withMessage('Password baru minimal 8 karakter.'),
  body('current_password').optional({ values: 'falsy' }).isString(),
];

export const productCreateRules = [
  body('name').trim().isLength({ min: 2, max: 180 }).withMessage('Nama produk 2-180 karakter.'),
  body('category_id').isInt({ min: 1 }).withMessage('Kategori wajib dipilih.'),
  body('short_description').optional({ values: 'falsy' }).trim().isLength({ max: 300 }),
  body('description').optional({ values: 'falsy' }).isString(),
  body('specifications').optional({ values: 'falsy' }).isString(),
  body('slug').optional({ values: 'falsy' }).trim().isLength({ max: 190 }),
  body('image_id').optional({ values: 'falsy' }).isInt({ min: 1 }),
  booleanish('is_published'),
  booleanish('is_featured'),
  body('sort_order').optional({ values: 'falsy' }).isInt({ min: 0 }),
];

export const productUpdateRules = [idParam(), ...productCreateRules];

export const categoryRules = [
  body('name').trim().isLength({ min: 2, max: 140 }).withMessage('Nama kategori 2-140 karakter.'),
  body('description').optional({ values: 'falsy' }).isString(),
  body('slug').optional({ values: 'falsy' }).trim().isLength({ max: 160 }),
  body('image_id').optional({ values: 'falsy' }).isInt({ min: 1 }),
  booleanish('is_active'),
  body('sort_order').optional({ values: 'falsy' }).isInt({ min: 0 }),
];

export const categoryUpdateRules = [idParam(), ...categoryRules];

export const serviceRules = [
  body('title').trim().isLength({ min: 2, max: 180 }).withMessage('Judul layanan 2-180 karakter.'),
  body('description').optional({ values: 'falsy' }).isString(),
  body('detail').optional({ values: 'falsy' }).isString(),
  body('image_id').optional({ values: 'falsy' }).isInt({ min: 1 }),
  booleanish('is_published'),
  body('sort_order').optional({ values: 'falsy' }).isInt({ min: 0 }),
];

export const serviceUpdateRules = [idParam(), ...serviceRules];

export const contactRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Nama 2-120 karakter.'),
  body('email').trim().isEmail().withMessage('Email tidak valid.').isLength({ max: 160 }),
  body('phone').trim().isLength({ min: 6, max: 40 }).withMessage('Nomor telepon 6-40 karakter.').matches(/^[0-9+()\s.-]+$/).withMessage('Nomor telepon tidak valid.'),
  body('message').trim().isLength({ min: 10, max: 3000 }).withMessage('Pesan 10-3000 karakter.'),
  body('website').optional({ values: 'falsy' }).isString(),
];

export const messageUpdateRules = [
  idParam(),
  body('status').isIn(['unread', 'read', 'replied']).withMessage('Status pesan tidak valid.'),
];

export const mediaUpdateRules = [
  idParam(),
  body('title').trim().isLength({ min: 1, max: 160 }).withMessage('Nama gambar wajib diisi.'),
  body('alt_text').optional().isString().isLength({ max: 255 }),
];

export const idRule = [idParam()];
