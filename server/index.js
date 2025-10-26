import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import moviesRouter from './routes/movies.js';
import authRouter from './routes/auth.js';
import watchlistRouter from './routes/watchlist.js';

const app = express();


app.use(cors());
app.use(bodyParser.json());

app.use('/api', moviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/watchlist', watchlistRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
