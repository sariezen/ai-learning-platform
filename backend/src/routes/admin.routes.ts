import { Router } from 'express';
import { getAllUsers, getAllPrompts } from '../controllers/admin.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/prompts', authMiddleware, adminMiddleware, getAllPrompts);

export default router;
