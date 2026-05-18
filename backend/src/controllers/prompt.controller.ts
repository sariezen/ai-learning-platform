import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { Prompt } from '../models/prompt.entity';
import { Category } from '../models/category.entity';
import { SubCategory } from '../models/sub-category.entity';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generateLesson } from '../services/ai.service';

const promptRepo = () => AppDataSource.getRepository(Prompt);
const categoryRepo = () => AppDataSource.getRepository(Category);
const subCategoryRepo = () => AppDataSource.getRepository(SubCategory);

export const submitPrompt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { category_id, sub_category_id, prompt } = req.body;

    // Validate category exists
    const category = await categoryRepo().findOne({ where: { id: category_id } });
    if (!category) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    // Validate sub-category exists and belongs to category
    const subCategory = await subCategoryRepo().findOne({
      where: { id: sub_category_id, category_id },
    });
    if (!subCategory) {
      res.status(404).json({ error: 'Sub-category not found or does not belong to this category.' });
      return;
    }

    // Generate AI response
    const aiResponse = await generateLesson(
      category.name,
      subCategory.name,
      prompt
    );

    // Save prompt + response
    const newPrompt = promptRepo().create({
      user_id: userId,
      category_id,
      sub_category_id,
      prompt,
      response: aiResponse,
    });

    const saved = await promptRepo().save(newPrompt);

    res.status(201).json({
      id: saved.id,
      prompt: saved.prompt,
      response: saved.response,
      category: category.name,
      sub_category: subCategory.name,
      created_at: saved.created_at,
    });
  } catch (error: any) {
    console.error('Submit prompt error:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};

export const getMyHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [prompts, total] = await promptRepo().findAndCount({
      where: { user_id: userId },
      relations: ['category', 'sub_category'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    res.json({
      data: prompts.map((p) => ({
        id: p.id,
        prompt: p.prompt,
        response: p.response,
        category: p.category?.name,
        sub_category: p.sub_category?.name,
        created_at: p.created_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get history error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
