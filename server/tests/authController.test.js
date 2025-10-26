import { describe, it, expect, beforeEach, vi } from 'vitest';
import { register,login } from '../Controllers/authController.js';
import * as authService from '../Services/authService.js';

vi.mock('../Services/authService.js');

describe('Auth Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      body: {},
    };

    mockRes = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      mockReq.body = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123456',
      };

      const mockResult = {
        user: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        token: 'mockToken123',
      };

      authService.registerUser.mockResolvedValue(mockResult);

      await register(mockReq, mockRes);

      expect(authService.registerUser).toHaveBeenCalledWith(
        'John',
        'Doe',
        'john@example.com',
        'password123456'
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 if first_name is missing', async () => {
      mockReq.body = {
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123456',
      };

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'All fields are required',
      });
      expect(authService.registerUser).not.toHaveBeenCalled();
    });

    it('should return 400 if last_name is missing', async () => {
      mockReq.body = {
        first_name: 'John',
        email: 'john@example.com',
        password: 'password123456',
      };

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'All fields are required',
      });
    });

    it('should return 400 if email is missing', async () => {
      mockReq.body = {
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123456',
      };

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'All fields are required',
      });
    });

    it('should return 400 if password is missing', async () => {
      mockReq.body = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      };

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'All fields are required',
      });
    });

    it('should return 400 if user already exists', async () => {
      mockReq.body = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123456',
      };

      authService.registerUser.mockRejectedValue(
        new Error('User already exists')
      );

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User already exists',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'password123456',
      };

      const mockResult = {
        user: { id: 1, email: 'john@example.com' },
        token: 'mockToken123',
      };

      authService.loginUser.mockResolvedValue(mockResult);

      await login(mockReq, mockRes);

      expect(authService.loginUser).toHaveBeenCalledWith(
        'john@example.com',
        'password123456'
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 401 if credentials are invalid', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      authService.loginUser.mockRejectedValue(
        new Error('Invalid credentials')
      );

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid credentials',
      });
    });

    it('should return 401 if user does not exist', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'password123456',
      };

      authService.loginUser.mockRejectedValue(
        new Error('Invalid credentials')
      );

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid credentials',
      });
    });
  });
});