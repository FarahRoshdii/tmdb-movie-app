import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../Services/authService.js';
import db from '../config/db.js';

vi.mock('../config/db.js');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      db.query.mockResolvedValueOnce([[]]); 
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      db.query.mockResolvedValueOnce([{ insertId: 1 }]); 
      jwt.sign.mockReturnValue('mockToken123');

      const result = await registerUser(
        mockUser.first_name,
        mockUser.last_name,
        mockUser.email,
        mockUser.password
      );

      expect(db.query).toHaveBeenCalledWith(
        'SELECT id FROM users WHERE email = ?',
        [mockUser.email]
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [mockUser.first_name, mockUser.last_name, mockUser.email, 'hashedPassword123']
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, email: mockUser.email },
        expect.any(String),
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        user: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        token: 'mockToken123',
      });
    });

    it('should throw error if user already exists', async () => {
      db.query.mockResolvedValueOnce([[{ id: 1 }]]); 

      await expect(
        registerUser('John', 'Doe', 'john@example.com', 'password123')
      ).rejects.toThrow('User already exists');

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should handle database errors during registration', async () => {
      db.query.mockRejectedValueOnce(new Error('Database connection failed'));

      await expect(
        registerUser('John', 'Doe', 'john@example.com', 'password123')
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: 'hashedPassword123',
      };

      db.query.mockResolvedValueOnce([[mockUser]]);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken123');

      const result = await loginUser('john@example.com', 'password123');

      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, email, password FROM users WHERE email = ?',
        ['john@example.com']
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, email: 'john@example.com' },
        expect.any(String),
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        user: { id: 1, email: 'john@example.com' },
        token: 'mockToken123',
      });
    });

    it('should throw error if user does not exist', async () => {
      db.query.mockResolvedValueOnce([[]]);

      await expect(
        loginUser('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid credentials');

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: 'hashedPassword123',
      };

      db.query.mockResolvedValueOnce([[mockUser]]);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        loginUser('john@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');

      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});

