import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import pool from "../config/db.js";


dotenv.config({ path: path.resolve("../.env") }); 



const TMDB_BASE = process.env.TMDB_BASE_URL;
const TMDB_TOKEN = process.env.TMDB_BEARER_TOKEN;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchNowPlayingMovies(pages = 5) {
  const allMovies = [];
  for (let page = 1; page <= pages; page++) {
    const res = await axios.get(`${TMDB_BASE}/movie/now_playing`, {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
      params: { page },
    });
    allMovies.push(...res.data.results);
    await delay(250);
  }
  return allMovies;
}

async function fetchMovieDetails(movieId) {
  try {
    const res = await axios.get(`${TMDB_BASE}/movie/${movieId}`, {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
    });
    await delay(250);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch details for movie ${movieId}:`, error.message);
    return null;
  }
}

async function seedMovies() {
  const connection = await pool.getConnection();
  try {
    console.log("Fetching now playing movies from TMDB...");
    const movies = await fetchNowPlayingMovies(5);
    console.log(`Fetched ${movies.length} movies.`);

    console.log("Processing movies with detailed information...");
    let processed = 0;

    for (const movie of movies) {
      const details = await fetchMovieDetails(movie.id);
      if (!details) continue;

      await connection.beginTransaction();

      try {
        const movieQuery = `
          INSERT INTO movies 
            (id, title, poster_path, backdrop_path, release_date, runtime,
             vote_average, overview, tagline, status, budget,
             revenue, imdb_id, homepage)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            poster_path = VALUES(poster_path),
            backdrop_path = VALUES(backdrop_path),
            release_date = VALUES(release_date),
            runtime = VALUES(runtime),
            vote_average = VALUES(vote_average),
            overview = VALUES(overview),
            tagline = VALUES(tagline),
            status = VALUES(status),
            budget = VALUES(budget),
            revenue = VALUES(revenue),
            imdb_id = VALUES(imdb_id),
            homepage = VALUES(homepage)
        `;

        await connection.query(movieQuery, [
          details.id,
          details.title,
          details.poster_path,
          details.backdrop_path,
          details.release_date || null,
          details.runtime || null,
          details.vote_average || null,
          details.overview || null,
          details.tagline || null,
          details.status || null,
          details.budget || null,
          details.revenue || null,
          details.imdb_id || null,
          details.homepage || null,
        ]);

        if (details.genres?.length) {
          const genreValues = details.genres.map((g) => [details.id, g.id]);
          await connection.query(
            `INSERT IGNORE INTO movie_genres (movie_id, genre_id) VALUES ?`,
            [genreValues]
          );
        }

        await connection.commit();
        processed++;

        if (processed % 10 === 0) {
          console.log(`processed ${processed}/${movies.length} movies...`);
        }
      } catch (error) {
        console.error(`Failed to store movie ${movie.id}:`, error.message);
        await connection.rollback();
      }
    }

    console.log(`Successfully seeded ${processed} movies with full details!`);
  } catch (error) {
    console.error("Error during seeding:", error.message);
    await connection.rollback();
  } finally {
    connection.release();
    console.log("Database connection released.");
  }
}

async function main() {
  console.time("seeding completed in");
  await seedMovies();
  await pool.end();
  console.timeEnd("Seeding completed in");
}

main();