import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(json());

app.listen(PORT, () => {
  console.log(`Server was started at port ${PORT}`);
});
