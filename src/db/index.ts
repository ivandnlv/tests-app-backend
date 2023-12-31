import mysql from 'mysql';

// Variables from .env file, need to create at the root directory
import {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_LOGIN,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} from '../utils';

const connection = mysql.createConnection({
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  user: DATABASE_LOGIN,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
});

export default connection;
