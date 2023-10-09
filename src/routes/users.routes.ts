import { Router } from 'express';
import { usersController } from '../controllers';
import { registerValidator, authValidator, isAuth, isAdmin } from '../middlewares';

const usersRouter = Router();

const path = '/users';

usersRouter.post(path + '/register', registerValidator, usersController.createUser);
usersRouter.post(path + '/login', authValidator, usersController.checkUser);
usersRouter.get(path, usersController.getAllUsers);
usersRouter.get(path + '/:user_id', usersController.getUser);
usersRouter.patch(path + '/:user_id', usersController.updateUser);
usersRouter.delete(path + '/:user_id', isAuth, usersController.deleteUser);

export { usersRouter };
