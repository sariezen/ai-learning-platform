import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { register, login } from '../controllers/auth.controller';

// Mock the database
jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

import { AppDataSource } from '../config/database';

const mockRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should return 409 if user already exists', async () => {
      mockRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' });

      const req = { body: { name: 'Test', phone: '0501234567', email: 'test@test.com', password: '123456' } } as Request;
      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'User with this email or phone already exists.' });
    });

    it('should return 201 and token on successful registration', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({ id: 1, name: 'Test', email: 'test@test.com', phone: '0501234567', role: 'user' });
      mockRepo.save.mockResolvedValue({ id: 1, name: 'Test', email: 'test@test.com', phone: '0501234567', role: 'user' });

      const req = { body: { name: 'Test', phone: '0501234567', email: 'test@test.com', password: '123456' } } as Request;
      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const req = { body: { email: 'notfound@test.com', password: '123456' } } as Request;
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password.' });
    });

    it('should return 401 if password is wrong', async () => {
      mockRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com', password: await bcrypt.hash('correctpass', 10) });

      const req = { body: { email: 'test@test.com', password: 'wrongpass' } } as Request;
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return token on successful login', async () => {
      const hashedPassword = await bcrypt.hash('123456', 10);
      mockRepo.findOne.mockResolvedValue({ id: 1, name: 'Test', email: 'test@test.com', role: 'user', password: hashedPassword });

      const req = { body: { email: 'test@test.com', password: '123456' } } as Request;
      const res = mockRes();

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
    });
  });
});
