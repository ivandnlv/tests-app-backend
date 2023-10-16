import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './utils';

import { testRouter, questionsRouter, answersRouter, usersRouter } from './routes';

const app = express();
app.use(cors());
app.use(json());
app.use(cookieParser());

// Routes
const mainPath = '/api';
app.use(mainPath, testRouter);
app.use(mainPath, questionsRouter);
app.use(mainPath, answersRouter);
app.use(mainPath, usersRouter);

app.listen(PORT, () => {
  console.log(`Server was started at port ${PORT}`);
});
