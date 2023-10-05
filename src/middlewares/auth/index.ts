import { body } from 'express-validator';
import { roles } from '../../types';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../../utils/variables';
import { UserRoles } from '../../types';
import jwt from 'jsonwebtoken';

export const registerValidator = [
  body('email').isEmail().withMessage('Неправильно введен email'),
  body('password')
    .isLength({ min: 6, max: 255 })
    .withMessage('Длина пароля должна быть не менее 6 символов и не более 255 символов'),
  body(['firstname', 'lastname']),
  body('middlename')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Длина имени и фамилии может быть от 2 до 255 символов'),
  body('role')
    .isIn([...Object.values(roles)])
    .withMessage('Выберите роль'),
];

export const authValidator = [
  body('email').isEmail().withMessage('Неправильно введен email'),
  body('password')
    .isLength({ min: 6, max: 255 })
    .withMessage('Длина пароля должна быть не менее 6 символов и не более 255 символов'),
];

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const errMessage = 'Вы должны быть авторизованы';
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (!token.length) {
      return res.status(401).json({
        message: errMessage,
      });
    }

    const decryptToken = jwt.verify(token, JWT_SECRET ?? '123');

    if (!decryptToken) {
      return res.status(401).json({
        message: errMessage,
      });
    } else {
      req.token = token;
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: errMessage,
    });
  }
};
