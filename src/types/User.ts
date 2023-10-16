export const roles = {
  ADMIN: 1,
  USER: 2,
  TEACHER: 3,
} as const;

export type UserRoles = typeof roles.TEACHER | typeof roles.USER | typeof roles.ADMIN;

export interface User {
  user_id: string;
  lastname: string;
  firstname: string;
  middlename?: string;
  token: string;
  email: string;
  role_id: UserRoles;
  password_hash: string;
  role_name: string;
}

declare global {
  namespace Express {
    interface Request {
      token: string;
    }
  }
}
