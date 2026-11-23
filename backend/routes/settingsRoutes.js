import { Router } from 'express';
import {
  getAllSettings,
  getPublicSettings,
  updateSettings,
} from '../controllers/settingsController.js';
import { requireAuth, requireCsrf } from '../middleware/auth.js';

const router = Router();

router.get('/', getPublicSettings);
router.get('/all', requireAuth, getAllSettings);
router.put('/', requireAuth, requireCsrf, updateSettings);

export default router;
