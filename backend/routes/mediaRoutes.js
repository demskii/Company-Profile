import { Router } from 'express';
import { deleteMedia, listMedia, updateMedia, uploadMedia } from '../controllers/mediaController.js';
import { requireAuth, requireCsrf } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { idRule, mediaUpdateRules } from '../middleware/validators.js';
import { validate } from '../middleware/error.js';

const router = Router();

router.use(requireAuth);
router.get('/', listMedia);
router.post('/', requireCsrf, uploadImage, uploadMedia);
router.put('/:id', requireCsrf, mediaUpdateRules, validate, updateMedia);
router.delete('/:id', requireCsrf, idRule, validate, deleteMedia);

export default router;
