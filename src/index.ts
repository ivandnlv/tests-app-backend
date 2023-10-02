import express, { json } from 'express';
import cors from 'cors';
import { PORT } from './utils/variables';
import { testRouter, questionsRouter } from './routes';

const app = express();
app.use(cors());
app.use(json());

const mainPath = '/api';

app.use(mainPath, testRouter);
app.use(mainPath, questionsRouter);

app.listen(PORT, () => {
  console.log(`Server was started at port ${PORT}`);
});
