import { config } from 'dotenv';

config();

export const {
  PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_LOGIN,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  JWT_SECRET,
} = process.env;
