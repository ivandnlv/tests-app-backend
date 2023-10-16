import { Request, Response } from 'express';
import db from '../../db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils';
import { CreateUserRequest } from './users.types';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { User, UserRoles, roles } from '../../types';

const generateAccessToken = (id: string, role_id: UserRoles) => {
  const payload = { id, role_id };

  return jwt.sign(payload, JWT_SECRET ?? '123', { expiresIn: '10m' });
};

const generateRefreshToken = (id: string, role_id: UserRoles) => {
  const payload = { id, role_id };

  return jwt.sign(payload, JWT_SECRET ?? '123', { expiresIn: '30d' });
};

class UsersController {
  async createUser(req: CreateUserRequest, res: Response) {
    try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.status(400).json(validationErrors);
      }

      const { email, firstname, lastname, role_id, middlename, password } = req.body;

      db.query('SELECT email FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        } else {
          if (result.length) {
            return res.status(400).json({
              message: 'Пользователь с таким email адресом уже существует',
            });
          }
        }
      });

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      let sqlQuery = 'INSERT INTO users (firstname, lastname, role_id, email, password_hash, ';
      let sqlValues = [firstname, lastname, role_id, email, passwordHash];

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
          db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, result) => {
            if (err) {
              return res.status(400).json({
                message: err.message,
              });
            } else {
              const { user_id: userId, role_id: roleId } = result[0];
              const accessToken = generateAccessToken(userId, roleId);
              const refreshToken = generateRefreshToken(userId, roleId);

              db.query(
                'INSERT INTO tokens (user_id, token) VALUES (?, ?)',
                [userId, refreshToken],
                (err) => {
                  if (err) {
                    return res.status(400).json({
                      message: err.message,
                    });
                  } else {
                    return res.cookie('refreshToken', refreshToken).json({
                      status: 'success',
                      accessToken,
                    });
                  }
                },
              );
            }
          });
        }
      });
    } catch (error) {
      return res.status(500).json(error);
    }
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
          if (!result[0]) {
            return res.status(400).json({
              message: 'Неверные email или пароль',
            });
          }

          const { password_hash: passwordHash, role_id: roleId, user_id: userId } = result[0];
          const isCorrect = await bcrypt.compare(password, passwordHash);

          if (isCorrect) {
            const accessToken = generateAccessToken(userId, roleId);
            const refreshToken = generateRefreshToken(userId, roleId);
            db.query('SELECT * FROM tokens WHERE user_id = ?', [userId], (err, tokenResult) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              } else if (tokenResult.length && tokenResult[0].token) {
                db.query(
                  'UPDATE tokens SET token = ? WHERE user_id = ?',
                  [refreshToken, userId],
                  (err) => {
                    if (err) {
                      return res.status(500).json({
                        message: err.message,
                      });
                    }
                  },
                );
              } else if (!tokenResult.length) {
                db.query(
                  'INSERT INTO tokens (user_id, token) VALUES (?, ?)',
                  [userId, refreshToken],
                  (err) => {
                    if (err) {
                      return res.status(500).json({
                        message: err.message,
                      });
                    }
                  },
                );
              }
            });
            return res.cookie('refreshToken', refreshToken).json({
              status: 'success',
              accessToken,
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
    try {
      db.query(
        `
        SELECT users.*, roles.role_name
        FROM users
        JOIN roles ON users.role_id = roles.role_id;
      `,
        (err, _result) => {
          if (err) {
            return res.status(400).json({
              message: err.message,
            });
          } else {
            const result: User[] = _result;
            const users = result.map(
              ({ email, firstname, middlename, lastname, user_id, role_name }) => {
                if (middlename) {
                  return { email, firstname, middlename, lastname, user_id, role_name };
                } else {
                  return { email, firstname, lastname, user_id, role_name };
                }
              },
            );
            return res.json(users);
          }
        },
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  getUser(req: Request, res: Response) {
    const { user_id } = req.params;

    db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, _result) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        if (!_result.length) {
          return res.status(404).json({
            message: 'Пользователь не найден',
          });
        }
        const result: User[] = _result;
        let user: Partial<User> | null = null;
        if (result[0].middlename) {
          user = {
            user_id: result[0].user_id,
            firstname: result[0].firstname,
            middlename: result[0].middlename,
            lastname: result[0].lastname,
            email: result[0].email,
            role_id: result[0].role_id,
          };
        } else {
          user = {
            user_id: result[0].user_id,
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            email: result[0].email,
            role_id: result[0].role_id,
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
    const token = req.token;
    const payload = jwt.decode(token, { complete: true })?.payload;

    if (!payload || !token) {
      return res.status(400).json({
        message: 'Вы должны быть авторизованы',
      });
    }

    const { id, role_id } = payload as { id: string; role_id: string };

    const { user_id } = req.params;

    if (user_id !== id && role_id !== roles.ADMIN.toString()) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    } else {
      // Проверка не является ли удаляемый пользователь админом
      if (user_id !== id) {
        db.query('SELECT role FROM users WHERE user_id = ?', [user_id], (err, result) => {
          if (err) {
            return res.status(400).json({
              message: err.message,
            });
          } else {
            if (result[0].role_id === roles.ADMIN) {
              return res.status(403).json({
                message: 'Нет доступа',
              });
            }
          }
        });
      }

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
