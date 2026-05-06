import express, { json } from 'express'
import { connect } from './src/config/db.js';
import gameRoutes from './src/routes/game.routes.js'
import ratingRoutes from './src/routes/rating.routes.js'
import cors from 'cors'

import errorMiddleware from './src/middlewares/error.middleware.js';

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() })
});

app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/ratings', ratingRoutes);

app.use(errorMiddleware);

await connect();

app.listen(3000, () => {
    console.log("Server running at port 3000")
});