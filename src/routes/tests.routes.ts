import { Router } from 'express';
import { testsController } from '../controllers';
import { isAuth, isTeacher, createTestValidator, errorHandler } from '../middlewares';

const testRouter = Router();

const path = '/tests';

testRouter.get(path, isAuth, testsController.getAllTests);
testRouter.get(path + '/:id', isAuth, testsController.getOneTest);
testRouter.post(
  path,
  isAuth,
  isTeacher,
  createTestValidator,
  testsController.createTest,
  errorHandler,
);
testRouter.patch(path, isAuth, isTeacher, testsController.updateTest);
testRouter.delete(path + '/:test_id', isAuth, isTeacher, testsController.deleteTest);

export { testRouter };
