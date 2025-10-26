import express from 'express';
import { getPopularMovies, getNowPlayingMovies, getMovieById, searchMovies } from '../Controllers/MovieController.js';

const router = express.Router();


router.get("/movie/popular", getPopularMovies);
router.get("/movie/now_playing", getNowPlayingMovies);
router.get("/movie/:id", getMovieById);
router.get("/search/movie", searchMovies);

export default router;
