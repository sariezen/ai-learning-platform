import { Request, Response, NextFunction } from 'express';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, phone, email, password } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters.');
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 9) {
    errors.push('Phone is required and must be at least 9 characters.');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('A valid email is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters.');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validatePrompt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { category_id, sub_category_id, prompt } = req.body;
  const errors: string[] = [];

  if (!category_id || isNaN(Number(category_id))) {
    errors.push('A valid category_id is required.');
  }

  if (!sub_category_id || isNaN(Number(sub_category_id))) {
    errors.push('A valid sub_category_id is required.');
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    errors.push('Prompt is required and must be at least 3 characters.');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};
