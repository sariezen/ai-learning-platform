import { Router } from 'express';
import { submitPrompt, getMyHistory } from '../controllers/prompt.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validatePrompt } from '../middlewares/validation.middleware';

const router = Router();

router.post('/', authMiddleware, validatePrompt, submitPrompt);
router.get('/history', authMiddleware, getMyHistory);

export default router;
