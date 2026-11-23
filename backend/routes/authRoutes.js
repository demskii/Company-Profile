import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, updateProfile } from '../controllers/authController.js';
import { optionalAuth, requireAuth, requireCsrf } from '../middleware/auth.js';
import { loginRules, profileRules } from '../middleware/validators.js';
import { validate } from '../middleware/error.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
});

router.post('/login', loginLimiter, loginRules, validate, login);
router.post('/logout', optionalAuth, requireCsrf, logout);
router.get('/me', optionalAuth, me);
router.put('/profile', requireAuth, requireCsrf, profileRules, validate, updateProfile);

export default router;
