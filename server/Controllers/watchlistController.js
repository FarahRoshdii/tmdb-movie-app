import watchlistService from '../Services/watchlistService.js';


export const getWatchlist = async(req, res) => {
    try {
      const userId = req.params.userId;
      const watchlist = await watchlistService.getUserWatchlist(userId);
      res.json(watchlist);
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ error: error.message });
    }
  }

export const checkInWatchlist = async (req, res) => {
    try {
      const { userId, movieId } = req.params;
      const inWatchlist = await watchlistService.isInWatchlist(userId, movieId);
      res.json({ inWatchlist });
    } catch (error) {
      console.error('Check watchlist error:', error);
      res.status(500).json({ error: error.message });
    }
  }

export const addToWatchlist = async (req, res) => {
    try {
      const { userId, movieId, status } = req.body;

      if (!userId || !movieId) {
        return res.status(400).json({ error: 'userId and movieId are required' });
      }

      const result = await watchlistService.addToWatchlist(userId, movieId, status);
      res.status(201).json(result);
    } catch (error) {
      console.error('Add to watchlist error:', error);

      if (error.message === 'Movie already in watchlist') {
        return res.status(409).json({ error: error.message });
      }

      res.status(500).json({ error: error.message });
    }
  }

export const removeFromWatchlist = async (req, res) => {
    try {
      const { userId, movieId } = req.params;
      const result = await watchlistService.removeFromWatchlist(userId, movieId);
      res.json(result);
    } catch (error) {
      console.error('Remove from watchlist error:', error);

      if (error.message === 'Movie not found in watchlist') {
        return res.status(404).json({ error: error.message });
      }

      res.status(500).json({ error: error.message });
    }
  }

export const updateStatus = async (req, res) => {
    try {
      const { userId, movieId } = req.params;
      const { status } = req.body;

      if (!status || !['to watch', 'watched'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await watchlistService.updateStatus(userId, movieId, status);
      res.json(result);
    } catch (error) {
      console.error('Update status error:', error);

      if (error.message === 'Movie not found in watchlist') {
        return res.status(404).json({ error: error.message });
      }

      res.status(500).json({ error: error.message });
    }
  }
