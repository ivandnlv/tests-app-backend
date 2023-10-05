import { Request, Response } from 'express';
import db from '../../db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/variables';
import { CreateUserRequest } from './users.types';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { User } from '../../types';

class UsersController {
  async createUser(req: CreateUserRequest, res: Response) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json(validationErrors);
    }

    const { email, firstname, lastname, role, middlename, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    let sqlQuery = 'INSERT INTO users (firstname, lastname, role, email, password_hash, ';
    let sqlValues = [firstname, lastname, role, email, passwordHash];

    if (middlename) {
      sqlQuery += 'middlename) VALUES (?, ?, ?, ?, ?, ?)';
      sqlValues.push(middlename);
    } else {
      sqlQuery = sqlQuery.slice(0, -2) + ') VALUES (?, ?, ?, ?, ?)';
    }

    db.query({ sql: sqlQuery, values: sqlValues }, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
          if (err) {
            db.query('DELETE FROM users WHERE email = ?', [email]);
            return res.status(400).json({
              message: err.message,
            });
          } else {
            const { user_id } = result[0] as User;
            const token = jwt.sign({ user_id, role }, JWT_SECRET ?? '123');
            db.query('UPDATE users SET token = ? WHERE user_id = ? ', [token, user_id], (err) => {
              if (err) {
                return res.status(400).json({
                  message: err.message,
                });
              } else {
                return res.json({
                  status: 'success',
                  token,
                });
              }
            });
          }
        });
      }
    });
  }

  checkUser(req: Request, res: Response) {
    try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.status(400).json(validationErrors);
      }

      const { email, password } = req.body;

      db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err || !result.length) {
          return res.status(400).json({
            message: 'Неверные email или пароль',
          });
        } else {
          const hash = result[0].password_hash;
          const isCorrect = await bcrypt.compare(password, hash);

          if (isCorrect) {
            return res.json({
              status: 'success',
              token: result[0].token,
            });
          } else {
            return res.status(400).json({
              message: 'Неверные email или пароль',
            });
          }
        }
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  getAllUsers(req: Request, res: Response) {
    db.query('SELECT * FROM users', (err, _result) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        const result: User[] = _result;
        const users = result.map(({ email, firstname, middlename, lastname, role, user_id }) => {
          if (middlename) {
            return { email, firstname, middlename, lastname, role, user_id };
          } else {
            return { email, firstname, lastname, role, user_id };
          }
        });
        return res.json(users);
      }
    });
  }

  getUser(req: Request, res: Response) {
    const { user_id } = req.params;

    db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, _result) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        const result: User[] = _result;
        let user: Partial<User> | null = null;
        if (result[0].middlename) {
          user = {
            user_id: result[0].user_id,
            firstname: result[0].firstname,
            middlename: result[0].middlename,
            lastname: result[0].lastname,
            email: result[0].email,
            role: result[0].role,
          };
        } else {
          user = {
            user_id: result[0].user_id,
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            email: result[0].email,
            role: result[0].role,
          };
        }
        return res.json(user);
      }
    });
  }

  updateUser(req: Request, res: Response) {
    const { user_id } = req.params;
    const { email, firstname, lastname, middlename }: Partial<User> = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: 'Необходимо передать user_id!',
      });
    }

    let sqlQuery = 'UPDATE users SET ';
    let sqlValues: any[] = [];

    if (email) {
      sqlQuery += 'email = ?, ';
      sqlValues.push(email);
    }

    if (firstname) {
      sqlQuery += 'firstname = ?, ';
      sqlValues.push(firstname);
    }

    if (lastname) {
      sqlQuery += 'lastname = ?, ';
      sqlValues.push(lastname);
    }

    if (middlename) {
      sqlQuery += 'middlename = ?, ';
      sqlValues.push(middlename);
    }

    sqlValues.push(user_id);
    sqlQuery = sqlQuery.slice(0, -2);
    sqlQuery += 'WHERE user_id = ?';

    db.query({ sql: sqlQuery, values: sqlValues }, (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        return res.json({
          status: 'success',
        });
      }
    });
  }

  deleteUser(req: Request, res: Response) {
    const authUserId = req.user_id.toString();
    const role = req.role;

    const { user_id } = req.params;

    if (user_id !== authUserId && role !== 'admin') {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    } else {
      db.query('DELETE FROM users WHERE user_id = ?', [user_id], (err) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        } else {
          return res.json({
            message: 'success',
          });
        }
      });
    }
  }
}

export const usersController = new UsersController();
