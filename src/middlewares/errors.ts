import { Request, Response, NextFunction } from 'express';
import { DefaultError, NotFound, NoAccess, Unauthorized, BadRequest } from '../utils';

type Error = DefaultError | NotFound | NoAccess | Unauthorized | BadRequest;

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DefaultError) {
    return res.status(err.getCode()).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Что-то пошло не так',
  });
};

export { errorHandler };
