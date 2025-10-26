import express from 'express';
import { getWatchlist, checkInWatchlist, addToWatchlist, updateStatus, removeFromWatchlist } from '../Controllers/watchlistController.js';

const router = express.Router();

router.get('/:userId', getWatchlist);

router.get('/:userId/check/:movieId', checkInWatchlist);

router.post('/', addToWatchlist);

router.patch('/:userId/:movieId', updateStatus);

router.delete('/:userId/:movieId', removeFromWatchlist);

export default router;
