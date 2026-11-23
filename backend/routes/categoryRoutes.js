import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from '../controllers/categoryController.js';
import { optionalAuth, requireAuth, requireCsrf } from '../middleware/auth.js';
import { categoryRules, categoryUpdateRules, idRule } from '../middleware/validators.js';
import { validate } from '../middleware/error.js';

const router = Router();

router.get('/', optionalAuth, listCategories);
router.get('/:slug', optionalAuth, getCategory);
router.post('/', requireAuth, requireCsrf, categoryRules, validate, createCategory);
router.put('/:id', requireAuth, requireCsrf, categoryUpdateRules, validate, updateCategory);
router.delete('/:id', requireAuth, requireCsrf, idRule, validate, deleteCategory);

export default router;
