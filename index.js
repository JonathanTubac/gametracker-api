import express from 'express'
import { connect } from './src/config/db.js';

const app = express();

await connect();

app.listen(3000, ()=>{
    console.log("Server running at port 3000")
})