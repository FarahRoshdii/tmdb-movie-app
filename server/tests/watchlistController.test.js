import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getWatchlist,checkInWatchlist, addToWatchlist, removeFromWatchlist, updateStatus } from '../Controllers/watchlistController.js';
import watchlistService from '../Services/watchlistService.js';

vi.mock('../Services/watchlistService.js');

describe('Watchlist Controller', () => {
  let mockReq;
  let mockRes;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      params: {},
      body: {},
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

  describe('getWatchlist', () => {
    it('should return user watchlist', async () => {
      mockReq.params.userId = '1';
      const mockWatchlist = [
        { id: 1, movie_id: 100, title: 'Movie 1', status: 'to watch' },
        { id: 2, movie_id: 101, title: 'Movie 2', status: 'watched' },
      ];

      watchlistService.getUserWatchlist.mockResolvedValue(mockWatchlist);

      await getWatchlist(mockReq, mockRes);

      expect(watchlistService.getUserWatchlist).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockWatchlist);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return empty array if watchlist is empty', async () => {
      mockReq.params.userId = '1';
      watchlistService.getUserWatchlist.mockResolvedValue([]);

      await getWatchlist(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it('should handle service errors', async () => {
      mockReq.params.userId = '1';
      watchlistService.getUserWatchlist.mockRejectedValue(
        new Error('Database error')
      );

      await getWatchlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Get watchlist error:',
        expect.any(Error)
      );
    });
  });

  describe('checkInWatchlist', () => {
    it('should return true if movie is in watchlist', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      watchlistService.isInWatchlist.mockResolvedValue(true);

      await checkInWatchlist(mockReq, mockRes);

      expect(watchlistService.isInWatchlist).toHaveBeenCalledWith('1', '100');
      expect(mockRes.json).toHaveBeenCalledWith({ inWatchlist: true });
    });

    it('should return false if movie is not in watchlist', async () => {
      mockReq.params = { userId: '1', movieId: '999' };
      watchlistService.isInWatchlist.mockResolvedValue(false);

      await checkInWatchlist(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ inWatchlist: false });
    });

    it('should handle service errors', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      watchlistService.isInWatchlist.mockRejectedValue(
        new Error('Check failed')
      );

      await checkInWatchlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Check failed' });
    });
  });

  describe('addToWatchlist', () => {
    it('should add movie to watchlist with default status', async () => {
      mockReq.body = { userId: 1, movieId: 100 };
      const mockResult = {
        id: 1,
        user_id: 1,
        movie_id: 100,
        status: 'to watch',
      };

      watchlistService.addToWatchlist.mockResolvedValue(mockResult);

      await addToWatchlist(mockReq, mockRes);

      expect(watchlistService.addToWatchlist).toHaveBeenCalledWith(
        1,
        100,
        undefined
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should add movie with custom status', async () => {
      mockReq.body = { userId: 1, movieId: 100, status: 'watched' };
      const mockResult = {
        id: 1,
        user_id: 1,
        movie_id: 100,
        status: 'watched',
      };

      watchlistService.addToWatchlist.mockResolvedValue(mockResult);

      await addToWatchlist(mockReq, mockRes);

      expect(watchlistService.addToWatchlist).toHaveBeenCalledWith(
        1,
        100,
        'watched'
      );
    });

    it('should return 400 if userId is missing', async () => {
      mockReq.body = { movieId: 100 };

      await addToWatchlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'userId and movieId are required',
      });
      expect(watchlistService.addToWatchlist).not.toHaveBeenCalled();
    });

    it('should return 400 if movieId is missing', async () => {
      mockReq.body = { userId: 1 };

      await addToWatchlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'userId and movieId are required',
      });
    });

    it('should return 409 if movie already in watchlist', async () => {
      mockReq.body = { userId: 1, movieId: 100 };
      watchlistService.addToWatchlist.mockRejectedValue(
        new Error('Movie already in watchlist')
      );

      await addToWatchlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Movie already in watchlist',
      });
    });

    it('should handle other service errors with 500', async () => {
      mockReq.body = { userId: 1, movieId: 100 };
      watchlistService.addToWatchlist.mockRejectedValue(
        new Error('Database error')
      );

      await addToWatchlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove movie from watchlist successfully', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      const mockResult = { message: 'Removed from watchlist' };

      watchlistService.removeFromWatchlist.mockResolvedValue(mockResult);

      await removeFromWatchlist(mockReq, mockRes);

      expect(watchlistService.removeFromWatchlist).toHaveBeenCalledWith(
        '1',
        '100'
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 404 if movie not found in watchlist', async () => {
      mockReq.params = { userId: '1', movieId: '999' };
      watchlistService.removeFromWatchlist.mockRejectedValue(
        new Error('Movie not found in watchlist')
      );

      await removeFromWatchlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Movie not found in watchlist',
      });
    });

    it('should handle other service errors with 500', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      watchlistService.removeFromWatchlist.mockRejectedValue(
        new Error('Database error')
      );

      await removeFromWatchlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('updateStatus', () => {
    it('should update status to watched', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      mockReq.body = { status: 'watched' };
      const mockResult = { message: 'Status updated' };

      watchlistService.updateStatus.mockResolvedValue(mockResult);

      await updateStatus(mockReq, mockRes);

      expect(watchlistService.updateStatus).toHaveBeenCalledWith(
        '1',
        '100',
        'watched'
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should update status to to watch', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      mockReq.body = { status: 'to watch' };
      const mockResult = { message: 'Status updated' };

      watchlistService.updateStatus.mockResolvedValue(mockResult);

      await updateStatus(mockReq, mockRes);

      expect(watchlistService.updateStatus).toHaveBeenCalledWith(
        '1',
        '100',
        'to watch'
      );
    });

    it('should return 400 if status is missing', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      mockReq.body = {};

      await updateStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid status' });
      expect(watchlistService.updateStatus).not.toHaveBeenCalled();
    });

    it('should return 400 if status is invalid', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      mockReq.body = { status: 'invalid_status' };

      await updateStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid status' });
    });

    it('should return 404 if movie not found in watchlist', async () => {
      mockReq.params = { userId: '1', movieId: '999' };
      mockReq.body = { status: 'watched' };
      watchlistService.updateStatus.mockRejectedValue(
        new Error('Movie not found in watchlist')
      );

      await updateStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Movie not found in watchlist',
      });
    });

    it('should handle other service errors with 500', async () => {
      mockReq.params = { userId: '1', movieId: '100' };
      mockReq.body = { status: 'watched' };
      watchlistService.updateStatus.mockRejectedValue(
        new Error('Database error')
      );

      await updateStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});