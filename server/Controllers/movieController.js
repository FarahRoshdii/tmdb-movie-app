import movieService from '../Services/movieService.js';

export const getPopularMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const data = await movieService.getPopularMovies(page);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getNowPlayingMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const data = await movieService.getNowPlayingMovies(page);
    res.json(data);
  } catch (err) {
    console.error("Now playing movies error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const searchMovies = async (req, res) => {
  const { query, page } = req.query;
  try {
    const data = await movieService.searchMovies(query, page);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
};
