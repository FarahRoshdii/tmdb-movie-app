# TMDB Movie App (React + TypeScript + Express)

Brief
- Frontend: React + TypeScript (Vite).
- Backend: Express (Node) storing movies, users, and watchlists locally.


Technical decisions
- Vite + React + TypeScript for fast dev and type safety.
- React Query: Simplifies server state management by handling data fetching, caching, pagination, and automatic refetching with minimal boilerplate.
- MySQL + mysql2: Stores movies, users, and watchlists. Easy to seed and manage locally.

Trade-offs
- Not using a full ORM (like Sequelize, ActiveRecord) keeps it simple, but requires writing raw SQL queries.



How to run
1. Copy server .env.example and set TMDB_API_KEY and JWT_SECRET:
2. run npm run setup
3. run npm run dev which concurrently runs client and server.


What npm run setup does
1. Installs dependencies for server and client.
2. Creates the MySQL database if it doesn’t exist.
3. Seeds the database with movies and their genres.
                   

Unit Tests
- To run backend unit tests , run npm test in server directory.


API examples
- Movie details:
  GET /api/movie/<<id>>
- Auth:
  POST /api/auth/register { "first_name":"..." , "last_name":"...","email": "...", "password": "..." }
  POST /api/auth/login { "email": "...", "password": "..." }
- Watchlist:
  Authorization: Bearer <<token>>
  GET /api/watchlist
  POST /api/watchlist { movieId, title, poster_path, release_date }
  DELETE /api/watchlist/:movieId

Future improvements
- More unit & integration tests.
- Add Automated genres seed to the seeder.
