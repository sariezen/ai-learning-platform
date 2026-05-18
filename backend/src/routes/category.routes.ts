import { Router } from 'express';
import {
  getAllCategories,
  getSubCategories,
  createCategory,
  createSubCategory,
} from '../controllers/category.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getAllCategories);
router.get('/:id/sub-categories', authMiddleware, getSubCategories);
router.post('/', authMiddleware, adminMiddleware, createCategory);
router.post('/:id/sub-categories', authMiddleware, adminMiddleware, createSubCategory);

export default router;
