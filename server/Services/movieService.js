import pool from "../config/db.js";

const getPagination = (page, limit = 20) => {
  const currentPage = Math.max(parseInt(page) || 1, 1);
  const offset = (currentPage - 1) * limit;
  return { limit, offset, page: currentPage };
};

const getPopularMovies = async (page) => {
  const { limit, offset } = getPagination(page);
  const [movies] = await pool.query(
    'SELECT * FROM movies ORDER BY vote_average DESC, release_date DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM movies');
  return {
    page,
    results: movies,
    total_pages: Math.ceil(totalCount[0].count / limit),
    total_results: totalCount[0].count
  };
};

const getNowPlayingMovies = async (page) => {
  const { limit, offset } = getPagination(page);
  const [movies] = await pool.query(`
    SELECT * FROM movies
    WHERE release_date <= CURDATE()
      AND release_date >= DATE_SUB(CURDATE(), INTERVAL 45 DAY)
    ORDER BY release_date DESC
    LIMIT ? OFFSET ?
  `, [limit, offset]);

  const [totalCount] = await pool.query(`
    SELECT COUNT(*) as count FROM movies
    WHERE release_date <= CURDATE()
      AND release_date >= DATE_SUB(CURDATE(), INTERVAL 45 DAY)
  `);

  return {
    page,
    results: movies,
    total_pages: Math.ceil(totalCount[0].count / limit),
    total_results: totalCount[0].count
  };
};

const getMovieById = async (id) => {
  const [movies] = await pool.query('SELECT * FROM movies WHERE id = ?', [id]);
  if (!movies.length) return null;

  const [genres] = await pool.query(`
    SELECT g.id, g.name
    FROM genres g
    JOIN movie_genres mg ON g.id = mg.genre_id
    WHERE mg.movie_id = ?
  `, [id]);

  return { ...movies[0], genres };
};

const searchMovies = async (query, page = 1) => {
  if (!query) throw new Error("Missing search query");
  const { limit, offset } = getPagination(page);
  const searchTerm = `%${query.toLowerCase()}%`;

  const [genres] = await pool.query('SELECT id FROM genres WHERE LOWER(name) LIKE ?', [searchTerm]);

  let sql, countSql, params = [];
  if (genres.length) {
    const genreIds = genres.map(g => g.id);
    sql = `SELECT DISTINCT m.* 
           FROM movies m 
           JOIN movie_genres mg ON m.id = mg.movie_id 
           WHERE mg.genre_id IN (${genreIds.map(() => '?').join(',')}) 
           ORDER BY m.vote_average DESC, m.release_date DESC`;
    countSql = `SELECT COUNT(DISTINCT m.id) as count 
                FROM movies m 
                JOIN movie_genres mg ON m.id = mg.movie_id 
                WHERE mg.genre_id IN (${genreIds.map(() => '?').join(',')})`;
    params = genreIds;
  } else {
    sql = 'SELECT * FROM movies WHERE LOWER(title) LIKE ? ORDER BY vote_average DESC, release_date DESC';
    countSql = 'SELECT COUNT(*) as count FROM movies WHERE LOWER(title) LIKE ?';
    params = [searchTerm];
  }

  const [results] = await pool.query(`${sql} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  const [totalCount] = await pool.query(countSql, params);

  return {
    page,
    results,
    total_pages: Math.ceil(totalCount[0].count / limit),
    total_results: totalCount[0].count
  };
};

const movieService = {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieById,
  searchMovies
};

export default movieService;
