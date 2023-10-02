import { Router } from 'express';
import { testsController } from '../controllers';

const router = Router();

const path = '/tests';

router.get(path, testsController.getAllTests);
router.get(path + '/:id', testsController.getOneTest);
router.post(path, testsController.createTest);
router.patch(path, testsController.updateTest);
router.delete(path, testsController.deleteTest);

export default router;
