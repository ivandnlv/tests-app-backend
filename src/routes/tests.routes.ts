import { Router } from 'express';
import { testsController } from '../controllers';

const testRouter = Router();

const path = '/tests';

testRouter.get(path, testsController.getAllTests);
testRouter.get(path + '/:id', testsController.getOneTest);
testRouter.post(path, testsController.createTest);
testRouter.patch(path, testsController.updateTest);
testRouter.delete(path, testsController.deleteTest);

export { testRouter };
