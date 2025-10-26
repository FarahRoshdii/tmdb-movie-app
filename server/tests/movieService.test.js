import { describe, it, expect, beforeEach, vi } from 'vitest';
import movieService from '../Services/movieService.js';
import pool from '../config/db.js';

vi.mock('../config/db.js');

describe('Movie Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPopularMovies', () => {
    it('should return popular movies with pagination', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1', vote_average: 8.5 },
        { id: 2, title: 'Movie 2', vote_average: 8.0 },
      ];
      const mockCount = [{ count: 100 }];

      pool.query.mockResolvedValueOnce([mockMovies]);
      pool.query.mockResolvedValueOnce([mockCount]);

      const result = await movieService.getPopularMovies(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies ORDER BY vote_average DESC, release_date DESC LIMIT ? OFFSET ?',
        [20, 0]
      );
      expect(pool.query).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM movies');
      expect(result).toEqual({
        page: 1,
        results: mockMovies,
        total_pages: 5,
        total_results: 100,
      });
    });

    it('should handle page 2 with correct offset', async () => {
      const mockMovies = [{ id: 3, title: 'Movie 3' }];
      const mockCount = [{ count: 100 }];

      pool.query.mockResolvedValueOnce([mockMovies]);
      pool.query.mockResolvedValueOnce([mockCount]);

      await movieService.getPopularMovies(2);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM movies ORDER BY vote_average DESC, release_date DESC LIMIT ? OFFSET ?',
        [20, 20]
      );
    });

    it('should default to page 1 if invalid page provided', async () => {
      const mockMovies = [];
      const mockCount = [{ count: 0 }];

      pool.query.mockResolvedValueOnce([mockMovies]);
      pool.query.mockResolvedValueOnce([mockCount]);

      await movieService.getPopularMovies(0);

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        [20, 0]
      );
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies with pagination', async () => {
      const mockMovies = [
        { id: 1, title: 'Now Playing 1', release_date: '2024-01-15' },
      ];
      const mockCount = [{ count: 50 }];

      pool.query.mockResolvedValueOnce([mockMovies]);
      pool.query.mockResolvedValueOnce([mockCount]);

      const result = await movieService.getNowPlayingMovies(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE release_date <= CURDATE()'),
        [20, 0]
      );
      expect(result).toEqual({
        page: 1,
        results: mockMovies,
        total_pages: 3,
        total_results: 50,
      });
    });

    it('should handle page 3 with correct offset', async () => {
      pool.query.mockResolvedValueOnce([[]]);
      pool.query.mockResolvedValueOnce([[{ count: 0 }]]);

      await movieService.getNowPlayingMovies(3);

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        [20, 40]
      );
    });
  });

  describe('getMovieById', () => {
    it('should return movie with genres', async () => {
      const mockMovie = { id: 1, title: 'Test Movie' };
      const mockGenres = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
      ];

      pool.query.mockResolvedValueOnce([[mockMovie]]);
      pool.query.mockResolvedValueOnce([mockGenres]);

      const result = await movieService.getMovieById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM movies WHERE id = ?', [1]);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('JOIN movie_genres'),
        [1]
      );
      expect(result).toEqual({
        ...mockMovie,
        genres: mockGenres,
      });
    });

    it('should return null if movie not found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const result = await movieService.getMovieById(999);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('should return movie with empty genres array if no genres found', async () => {
      const mockMovie = { id: 1, title: 'Test Movie' };
      pool.query.mockResolvedValueOnce([[mockMovie]]);
      pool.query.mockResolvedValueOnce([[]]);

      const result = await movieService.getMovieById(1);

      expect(result).toEqual({
        ...mockMovie,
        genres: [],
      });
    });
  });

  describe('searchMovies', () => {
    it('should throw error if query is missing', async () => {
      await expect(movieService.searchMovies('', 1)).rejects.toThrow(
        'Missing search query'
      );
      await expect(movieService.searchMovies(null, 1)).rejects.toThrow(
        'Missing search query'
      );
    });

    it('should search movies by title', async () => {
      const mockMovies = [{ id: 1, title: 'Action Movie' }];
      const mockCount = [{ count: 1 }];

      pool.query.mockResolvedValueOnce([[]]);
      pool.query.mockResolvedValueOnce([mockMovies]);
      pool.query.mockResolvedValueOnce([mockCount]);

      const result = await movieService.searchMovies('action', 1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id FROM genres WHERE LOWER(name) LIKE ?',
        ['%action%']
      );
      expect(result).toEqual({
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: 1,
      });
    });

    it('should search movies by genre', async () => {
      const mockGenres = [{ id: 28 }];
      const mockMovies = [
        { id: 1, title: 'Action Movie 1' },
        { id: 2, title: 'Action Movie 2' },
      ];
      const mockCount = [{ count: 2 }];

      pool.query.mockResolvedValueOnce([mockGenres]);
      pool.query.mockResolvedValueOnce([mockMovies]);
      pool.query.mockResolvedValueOnce([mockCount]);

      const result = await movieService.searchMovies('action', 1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id FROM genres WHERE LOWER(name) LIKE ?',
        ['%action%']
      );
      expect(result.results).toEqual(mockMovies);
      expect(result.total_results).toBe(2);
    });

    it('should handle pagination in search', async () => {
      pool.query.mockResolvedValueOnce([[]]); 
      pool.query.mockResolvedValueOnce([[]]);
      pool.query.mockResolvedValueOnce([[{ count: 0 }]]);

      await movieService.searchMovies('test', 2);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT ? OFFSET ?'),
        ['%test%', 20, 20]
      );
    });

    it('should return empty results if no matches found', async () => {
      pool.query.mockResolvedValueOnce([[]]); 
      pool.query.mockResolvedValueOnce([[]]);
      pool.query.mockResolvedValueOnce([[{ count: 0 }]]);

      const result = await movieService.searchMovies('nonexistent', 1);

      expect(result).toEqual({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      });
    });
  });
});

