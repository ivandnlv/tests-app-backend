import { Router } from 'express';
import { questionsController } from '../controllers';

const path = '/questions';

const questionsRouter = Router();

questionsRouter.post(path, questionsController.createQuestion);
questionsRouter.post(path + '/many', questionsController.createManyQuestions);
questionsRouter.get(path + '/:testId', questionsController.getQuestionsByTestId);
questionsRouter.patch(path, questionsController.updateQuestion);
questionsRouter.delete(path, questionsController.deleteQuestion);
questionsRouter.delete(path + '/all', questionsController.deleteAllQuestions);

export { questionsRouter };
