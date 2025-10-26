import { describe, it, expect, beforeEach, vi } from 'vitest';
import watchlistService from '../Services/watchlistService.js';
import pool from '../config/db.js';

vi.mock('../config/db.js');

describe('Watchlist Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserWatchlist', () => {
    it('should return user watchlist with movie details', async () => {
      const mockWatchlist = [
        {
          id: 1,
          user_id: 1,
          movie_id: 100,
          status: 'to watch',
          title: 'Movie 1',
          poster_path: '/poster1.jpg',
          vote_average: 8.5,
          release_date: '2024-01-15',
        },
        {
          id: 2,
          user_id: 1,
          movie_id: 101,
          status: 'watched',
          title: 'Movie 2',
          poster_path: '/poster2.jpg',
          vote_average: 7.8,
          release_date: '2024-02-20',
        },
      ];

      pool.query.mockResolvedValue([mockWatchlist]);

      const result = await watchlistService.getUserWatchlist(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('JOIN movies m ON w.movie_id = m.id'),
        [1]
      );
      expect(result).toEqual(mockWatchlist);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if user has no watchlist', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await watchlistService.getUserWatchlist(999);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(watchlistService.getUserWatchlist(1)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('isInWatchlist', () => {
    it('should return true if movie is in watchlist', async () => {
      pool.query.mockResolvedValue([[{ id: 1 }]]);

      const result = await watchlistService.isInWatchlist(1, 100);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id FROM watchlists WHERE user_id = ? AND movie_id = ?',
        [1, 100]
      );
      expect(result).toBe(true);
    });

    it('should return false if movie is not in watchlist', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await watchlistService.isInWatchlist(1, 999);

      expect(result).toBe(false);
    });
  });

  describe('addToWatchlist', () => {
    it('should add movie to watchlist with default status', async () => {
      pool.query.mockResolvedValueOnce([[]]); // isInWatchlist check
      pool.query.mockResolvedValueOnce([{ insertId: 10 }]); // insert result

      const result = await watchlistService.addToWatchlist(1, 100);

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO watchlists (user_id, movie_id, status) VALUES (?, ?, ?)',
        [1, 100, 'to watch']
      );
      expect(result).toEqual({
        id: 10,
        user_id: 1,
        movie_id: 100,
        status: 'to watch',
      });
    });

    it('should add movie to watchlist with custom status', async () => {
      pool.query.mockResolvedValueOnce([[]]); // isInWatchlist check
      pool.query.mockResolvedValueOnce([{ insertId: 11 }]);

      const result = await watchlistService.addToWatchlist(1, 101, 'watched');

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        [1, 101, 'watched']
      );
      expect(result.status).toBe('watched');
    });


  describe('removeFromWatchlist', () => {
    it('should remove movie from watchlist successfully', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await watchlistService.removeFromWatchlist(1, 100);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM watchlists WHERE user_id = ? AND movie_id = ?',
        [1, 100]
      );
      expect(result).toEqual({ message: 'Removed from watchlist' });
    });

    it('should throw error if movie not found in watchlist', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);
      await expect(
        watchlistService.removeFromWatchlist(1, 999)
      ).rejects.toThrow('Movie not found in watchlist');
    });
  });

  describe('updateStatus', () => {
    it('should update watchlist status successfully', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await watchlistService.updateStatus(1, 100, 'watched');

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE watchlists SET status = ? WHERE user_id = ? AND movie_id = ?',
        ['watched', 1, 100]
      );
      expect(result).toEqual({ message: 'Status updated' });
    });

    it('should update status from watched to to watch', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      await watchlistService.updateStatus(1, 100, 'to watch');

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        ['to watch', 1, 100]
      );
    });

    it('should throw error if movie not found in watchlist', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);
      await expect(
        watchlistService.updateStatus(1, 999, 'watched')
      ).rejects.toThrow('Movie not found in watchlist');
    });
  });
});

});

// watchlistController.test.js
