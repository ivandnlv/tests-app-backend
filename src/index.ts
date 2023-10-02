import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { testRouter, questionsRouter } from './routes';

config();

const PORT = process.env.PORT || 8080;
export const LOGIN = process.env.DATABASE_LOGIN;
export const PASSWORD = process.env.DATABASE_PASSWORD;

const app = express();
app.use(cors());
app.use(json());

const mainPath = '/api';

app.use(mainPath, testRouter);
app.use(mainPath, questionsRouter);

app.listen(PORT, () => {
  console.log(`Server was started at port ${PORT}`);
});
