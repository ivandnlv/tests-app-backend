import { Router } from 'express';
import { testsController } from '../controllers';
import { isAuth, isTeacher } from '../middlewares';

const testRouter = Router();

const path = '/tests';

testRouter.get(path, isAuth, testsController.getAllTests);
testRouter.get(path + '/:id', isAuth, testsController.getOneTest);
testRouter.post(path, isAuth, isTeacher, testsController.createTest);
testRouter.patch(path, isAuth, isTeacher, testsController.updateTest);
testRouter.delete(path + '/:test_id', isAuth, isTeacher, testsController.deleteTest);

export { testRouter };
