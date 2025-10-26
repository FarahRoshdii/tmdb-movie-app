import { describe, it, expect, beforeEach,afterEach, vi } from 'vitest';
import { getPopularMovies, getNowPlayingMovies, getMovieById, searchMovies } from '../Controllers/MovieController.js';
import movieService from '../Services/movieService.js';

vi.mock('../Services/movieService.js');

describe('Movie Controller', () => {
  let mockReq;
  let mockRes;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      query: {},
      params: {},
    };

    mockRes = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('getPopularMovies', () => {
    it('should return popular movies with default page', async () => {
      const mockData = {
        page: 1,
        results: [{ id: 1, title: 'Movie 1' }],
        total_pages: 5,
        total_results: 100,
      };

      movieService.getPopularMovies.mockResolvedValue(mockData);

      await getPopularMovies(mockReq, mockRes);

      expect(movieService.getPopularMovies).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return popular movies with specified page', async () => {
      mockReq.query.page = '3';
      const mockData = { page: 3, results: [] };

      movieService.getPopularMovies.mockResolvedValue(mockData);

      await getPopularMovies(mockReq, mockRes);

      expect(movieService.getPopularMovies).toHaveBeenCalledWith(3);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle service errors', async () => {
      movieService.getPopularMovies.mockRejectedValue(
        new Error('Database error')
      );

      await getPopularMovies(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies with default page', async () => {
      const mockData = {
        page: 1,
        results: [{ id: 1, title: 'Now Playing 1' }],
      };

      movieService.getNowPlayingMovies.mockResolvedValue(mockData);

      await getNowPlayingMovies(mockReq, mockRes);

      expect(movieService.getNowPlayingMovies).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it('should return now playing movies with specified page', async () => {
      mockReq.query.page = '2';
      const mockData = { page: 2, results: [] };

      movieService.getNowPlayingMovies.mockResolvedValue(mockData);

      await getNowPlayingMovies(mockReq, mockRes);

      expect(movieService.getNowPlayingMovies).toHaveBeenCalledWith(2);
    });

    it('should handle service errors', async () => {
      movieService.getNowPlayingMovies.mockRejectedValue(
        new Error('Failed to fetch')
      );

      await getNowPlayingMovies(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch' });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Now playing movies error:',
        expect.any(Error)
      );
    });
  });

  describe('getMovieById', () => {
    it('should return movie by id', async () => {
      mockReq.params.id = '1';
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        genres: [{ id: 28, name: 'Action' }],
      };

      movieService.getMovieById.mockResolvedValue(mockMovie);

      await getMovieById(mockReq, mockRes);

      expect(movieService.getMovieById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockMovie);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 404 if movie not found', async () => {
      mockReq.params.id = '999';
      movieService.getMovieById.mockResolvedValue(null);

      await getMovieById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Movie not found' });
    });

    it('should handle service errors', async () => {
      mockReq.params.id = '1';
      movieService.getMovieById.mockRejectedValue(
        new Error('Database connection failed')
      );

      await getMovieById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Database connection failed',
      });
    });
  });

  describe('searchMovies', () => {
    it('should search movies successfully', async () => {
      mockReq.query = { query: 'action', page: '1' };
      const mockData = {
        page: 1,
        results: [{ id: 1, title: 'Action Movie' }],
        total_results: 1,
      };

      movieService.searchMovies.mockResolvedValue(mockData);

      await searchMovies(mockReq, mockRes);

      expect(movieService.searchMovies).toHaveBeenCalledWith('action', '1');
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle search without page parameter', async () => {
      mockReq.query = { query: 'test' };
      const mockData = { page: 1, results: [] };

      movieService.searchMovies.mockResolvedValue(mockData);

      await searchMovies(mockReq, mockRes);

      expect(movieService.searchMovies).toHaveBeenCalledWith('test', undefined);
    });

    it('should handle service errors', async () => {
      mockReq.query = { query: 'test', page: '1' };
      movieService.searchMovies.mockRejectedValue(
        new Error('Search failed')
      );

      await searchMovies(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to fetch search results',
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle missing query parameter', async () => {
      mockReq.query = {};
      movieService.searchMovies.mockRejectedValue(
        new Error('Missing search query')
      );

      await searchMovies(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to fetch search results',
      });
    });
  });
});