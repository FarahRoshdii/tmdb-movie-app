import dotenv from "dotenv";
import path from "path";
import mysql from "mysql2/promise";

dotenv.config({ path: path.resolve("../.env") });

const DB_NAME = process.env.DB_NAME || 'tmdb_app';

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database "${DB_NAME}" is ready.`);
    await connection.end();
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
}

async function createTables(pool) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT PRIMARY KEY,
        title VARCHAR(255),
        name VARCHAR(255),
        poster_path VARCHAR(255),
        backdrop_path VARCHAR(255),
        release_date DATE,
        runtime INT,
        vote_average FLOAT,
        overview TEXT,
        tagline VARCHAR(255),
        status VARCHAR(50),
        budget BIGINT,
        revenue BIGINT,
        imdb_id VARCHAR(50),
        homepage VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS genres (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    // Movie Genre Junction Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movie_genres (
        movie_id INT,
        genre_id INT,
        PRIMARY KEY(movie_id, genre_id),
        FOREIGN KEY(movie_id) REFERENCES movies(id) ON DELETE CASCADE,
        FOREIGN KEY(genre_id) REFERENCES genres(id) ON DELETE CASCADE
      );
    `);

    // Watchlist table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS watchlists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        status ENUM('to watch', 'watched') DEFAULT 'to watch',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(movie_id) REFERENCES movies(id) ON DELETE CASCADE
      );
    `);

    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
}

async function seedGenres(pool) {
  try {
    const genres = [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
      { id: 36, name: 'History' },
      { id: 27, name: 'Horror' },
      { id: 10402, name: 'Music' },
      { id: 9648, name: 'Mystery' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Science Fiction' },
      { id: 10770, name: 'TV Movie' },
      { id: 53, name: 'Thriller' },
      { id: 10752, name: 'War' },
      { id: 37, name: 'Western' },
    ];

    for (const genre of genres) {
      await pool.query(
        `INSERT IGNORE INTO genres (id, name) VALUES (?, ?)`,
        [genre.id, genre.name]
      );
    }

    console.log('Genres seeded!');
  } catch (err) {
    console.error('Error seeding genres:', err);
  }
}

async function main() {
  await createDatabase();

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await createTables(pool);
  await seedGenres(pool);

  await pool.end();
  console.log('Database setup complete!');
}

main();
