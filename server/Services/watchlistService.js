import pool from "../config/db.js";

class WatchlistService {
  async getUserWatchlist(userId) {
    const [rows] = await pool.query(`
      SELECT w.*, m.title, m.poster_path, m.vote_average, m.release_date
      FROM watchlists w
      JOIN movies m ON w.movie_id = m.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);
    return rows;
  }

  async isInWatchlist(userId, movieId) {
    const [rows] = await pool.query(
      'SELECT id FROM watchlists WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );
    return rows.length > 0;
  }

  async addToWatchlist(userId, movieId, status = 'to watch') {
    const exists = await this.isInWatchlist(userId, movieId);
    if (exists) throw new Error('Movie already in watchlist');

    const [result] = await pool.query(
      'INSERT INTO watchlists (user_id, movie_id, status) VALUES (?, ?, ?)',
      [userId, movieId, status]
    );

    return {
      id: result.insertId,
      user_id: userId,
      movie_id: movieId,
      status
    };
  }

  async removeFromWatchlist(userId, movieId) {
    const [result] = await pool.query(
      'DELETE FROM watchlists WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );
    if (result.affectedRows === 0) throw new Error('Movie not found in watchlist');
    return { message: 'Removed from watchlist' };
  }

  async updateStatus(userId, movieId, status) {
    const [result] = await pool.query(
      'UPDATE watchlists SET status = ? WHERE user_id = ? AND movie_id = ?',
      [status, userId, movieId]
    );
    if (result.affectedRows === 0) throw new Error('Movie not found in watchlist');
    return { message: 'Status updated' };
  }
}

export default new WatchlistService();
