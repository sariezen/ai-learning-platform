import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/user.entity';
import { Category } from '../models/category.entity';
import { SubCategory } from '../models/sub-category.entity';
import { Prompt } from '../models/prompt.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'ai_learning_platform',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Category, SubCategory, Prompt],
  charset: 'utf8mb4',
});
