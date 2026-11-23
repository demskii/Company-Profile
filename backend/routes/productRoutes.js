import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../controllers/productController.js';
import { optionalAuth, requireAuth, requireCsrf } from '../middleware/auth.js';
import { idRule, productCreateRules, productUpdateRules } from '../middleware/validators.js';
import { validate } from '../middleware/error.js';

const router = Router();

router.get('/', optionalAuth, listProducts);
router.get('/id/:id', requireAuth, idRule, validate, getProductById);
router.get('/:slug', optionalAuth, getProduct);
router.post('/', requireAuth, requireCsrf, productCreateRules, validate, createProduct);
router.put('/:id', requireAuth, requireCsrf, productUpdateRules, validate, updateProduct);
router.delete('/:id', requireAuth, requireCsrf, idRule, validate, deleteProduct);

export default router;
