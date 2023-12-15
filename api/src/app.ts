import express, { Express, Request, Response , Application } from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { chatRouter } from './routes/chat';

//For env File 
dotenv.config();

const app: Application = express();
app.use(cors())
app.use(bodyParser.json())

app.use('/chat', chatRouter)

export default app