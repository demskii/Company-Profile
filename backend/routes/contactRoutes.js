import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  createMessage,
  deleteMessage,
  getMessage,
  listMessages,
  updateMessage,
} from '../controllers/contactController.js';
import { requireAuth, requireCsrf } from '../middleware/auth.js';
import { contactRules, idRule, messageUpdateRules } from '../middleware/validators.js';
import { validate } from '../middleware/error.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak pesan terkirim. Coba lagi nanti.' },
});

router.post('/', contactLimiter, contactRules, validate, createMessage);
router.get('/', requireAuth, listMessages);
router.get('/:id', requireAuth, idRule, validate, getMessage);
router.put('/:id', requireAuth, requireCsrf, messageUpdateRules, validate, updateMessage);
router.delete('/:id', requireAuth, requireCsrf, idRule, validate, deleteMessage);

export default router;
