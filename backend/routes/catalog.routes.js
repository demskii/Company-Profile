import { Router } from 'express'
import { listProducts, getProduct, listPortfolio, getPortfolioItem } from '../controllers/catalog.controller.js'

const router = Router()

// Endpoint publik: website company profile membaca katalog dari database.
router.get('/products', listProducts)
router.get('/products/:id', getProduct)
router.get('/portfolio', listPortfolio)
router.get('/portfolio/:id', getPortfolioItem)

export default router
