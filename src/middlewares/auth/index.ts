import { body } from 'express-validator';
import { UserRoles, roles } from '../../types';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../../utils/variables';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
  id: string;
  role: UserRoles;
}

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

export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.token;

    const payload = jwt.decode(token, { complete: true })?.payload as TokenPayload | undefined;

    if (!payload) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }

    if (payload.role !== 'teacher' && payload.role !== 'admin') {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.token;

    const payload = jwt.decode(token, { complete: true })?.payload as TokenPayload | undefined;

    if (!payload) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }

    if (payload.role !== 'admin') {
      return res.status(403).json({
        message: 'Нет досутпа',
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
