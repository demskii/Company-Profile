import { Router } from 'express';
import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from '../controllers/serviceController.js';
import { optionalAuth, requireAuth, requireCsrf } from '../middleware/auth.js';
import { idRule, serviceRules, serviceUpdateRules } from '../middleware/validators.js';
import { validate } from '../middleware/error.js';

const router = Router();

router.get('/', optionalAuth, listServices);
router.get('/:id', optionalAuth, idRule, validate, getService);
router.post('/', requireAuth, requireCsrf, serviceRules, validate, createService);
router.put('/:id', requireAuth, requireCsrf, serviceUpdateRules, validate, updateService);
router.delete('/:id', requireAuth, requireCsrf, idRule, validate, deleteService);

export default router;
