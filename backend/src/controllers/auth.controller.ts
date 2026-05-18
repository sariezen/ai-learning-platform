import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/user.entity';

const userRepo = () => AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, password } = req.body;

    // Check if user exists
    const existing = await userRepo().findOne({
      where: [{ email }, { phone }],
    });
    if (existing) {
      res.status(409).json({ error: 'User with this email or phone already exists.' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = userRepo().create({
      name,
      phone,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const saved = await userRepo().save(user);

    // Generate token
    const token = jwt.sign(
      { userId: saved.id, role: saved.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: 86400 } // 24 hours in seconds
    );

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: saved.id,
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
        role: saved.role,
      },
      token,
    });
  } catch (error: any) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = await userRepo().findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: 86400 } // 24 hours in seconds
    );

    res.json({
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
