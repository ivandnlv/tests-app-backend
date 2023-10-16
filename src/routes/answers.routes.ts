import { answersController } from '../controllers';
import { Router } from 'express';

const answersRouter = Router();
const path = '/answers';

answersRouter.post(path + '/:question_id', answersController.createOneAnswer);
answersRouter.post(path + '/many', answersController.createManyAnswers);
answersRouter.get(path + '/:question_id', answersController.getAnswersByQuestionId);
answersRouter.patch(path + '/:answer_id', answersController.updateAnswer);
answersRouter.delete(path + '/:answer_id', answersController.deleteAnswer);

export { answersRouter };
