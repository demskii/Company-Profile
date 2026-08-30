import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../controllers/catalog.controller.js'
import { requireAuth } from '../middleware/security.js'
import { handleValidation } from '../middleware/validate.js'

const router = Router()
const idValidation = [param('id').isInt({ min: 1 }).withMessage('ID tidak valid.')]
const imageValidation = body('image_url')
  .optional({ checkFalsy: true })
  .trim()
  .custom(value => /^https?:\/\/|^\/uploads\//i.test(value))
  .withMessage('URL gambar tidak valid.')

const productValidation = [
  body('category').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('name').trim().isLength({ min: 2, max: 150 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
  imageValidation,
]

const portfolioValidation = [
  body('title').trim().isLength({ min: 2, max: 150 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
  body('category').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  imageValidation,
]

router.use(requireAuth)

router.get('/products', listProducts)
router.post('/products', productValidation, handleValidation, createProduct)
router.put('/products/:id', [...idValidation, ...productValidation], handleValidation, updateProduct)
router.delete('/products/:id', idValidation, handleValidation, deleteProduct)

router.get('/portfolio', listPortfolio)
router.post('/portfolio', portfolioValidation, handleValidation, createPortfolioItem)
router.put('/portfolio/:id', [...idValidation, ...portfolioValidation], handleValidation, updatePortfolioItem)
router.delete('/portfolio/:id', idValidation, handleValidation, deletePortfolioItem)

export default router
