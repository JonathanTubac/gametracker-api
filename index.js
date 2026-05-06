import express from 'express'
import gameRoutes from './src/routes/game.routes.js'
import ratingRoutes from './src/routes/rating.routes.js'
import cors from 'cors'
import errorMiddleware from './src/middlewares/error.middleware.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/ratings', ratingRoutes);
app.use(errorMiddleware);

// await connect();

export default app;