export const roles = {
  TEACHER: 'teacher',
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRoles = typeof roles.TEACHER | typeof roles.USER | typeof roles.ADMIN;

export interface User {
  user_id: string;
  lastname: string;
  firstname: string;
  middlename?: string;
  token: string;
  email: string;
  role: UserRoles;
  password_hash: string;
}

declare global {
  namespace Express {
    interface Request {
      user_id: User['user_id'];
      role: User['role'];
    }
  }
}
