import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/user.entity';
import { Prompt } from '../models/prompt.entity';
import { AuthRequest } from '../middlewares/auth.middleware';

const userRepo = () => AppDataSource.getRepository(User);
const promptRepo = () => AppDataSource.getRepository(Prompt);

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await userRepo().findAndCount({
      select: ['id', 'name', 'email', 'phone', 'role', 'created_at'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getAllPrompts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const userId = req.query.user_id ? parseInt(req.query.user_id as string) : undefined;

    const whereClause: any = {};
    if (userId) {
      whereClause.user_id = userId;
    }

    const [prompts, total] = await promptRepo().findAndCount({
      where: whereClause,
      relations: ['user', 'category', 'sub_category'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    res.json({
      data: prompts.map((p) => ({
        id: p.id,
        user_name: p.user?.name,
        user_email: p.user?.email,
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
    console.error('Get all prompts error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
