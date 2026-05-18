import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../models/category.entity';
import { SubCategory } from '../models/sub-category.entity';

const categoryRepo = () => AppDataSource.getRepository(Category);
const subCategoryRepo = () => AppDataSource.getRepository(SubCategory);

export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryRepo().find({
      relations: ['sub_categories'],
    });
    res.json(categories);
  } catch (error: any) {
    console.error('Get categories error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getSubCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const subs = await subCategoryRepo().find({
      where: { category_id: categoryId },
    });
    res.json(subs);
  } catch (error: any) {
    console.error('Get sub-categories error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      res.status(400).json({ error: 'Category name is required (min 2 chars).' });
      return;
    }

    const category = categoryRepo().create({ name: name.trim() });
    const saved = await categoryRepo().save(category);
    res.status(201).json(saved);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Category already exists.' });
      return;
    }
    console.error('Create category error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createSubCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      res.status(400).json({ error: 'Sub-category name is required (min 2 chars).' });
      return;
    }

    // Verify category exists
    const category = await categoryRepo().findOne({ where: { id: categoryId } });
    if (!category) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    const sub = subCategoryRepo().create({
      name: name.trim(),
      category_id: categoryId,
    });
    const saved = await subCategoryRepo().save(sub);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('Create sub-category error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
