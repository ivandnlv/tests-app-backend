import mysql from 'mysql';
import { LOGIN, PASSWORD } from '../index';

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '2281',
  database: 'tests_db',
});

connection.connect();

export default connection;
