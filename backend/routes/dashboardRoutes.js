import { Router } from 'express';
import { activityList, dashboardStats } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/stats', dashboardStats);
router.get('/activity', activityList);

export default router;
