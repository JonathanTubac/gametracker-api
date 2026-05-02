import express, { json } from 'express'
import { connect } from './src/config/db.js';
import errorMiddleware from './src/middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() })
});

app.use(errorMiddleware);

await connect();

app.listen(3000, () => {
    console.log("Server running at port 3000")
})