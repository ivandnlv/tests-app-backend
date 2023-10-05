import { Request, Response } from 'express';
import { User } from '../../types';

interface CreateUserRequest extends Request {
  body: User & { password: string };
}

export { CreateUserRequest };
