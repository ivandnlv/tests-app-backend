import { body } from 'express-validator';

export const createTestValidator = [
  body('name')
    .isLength({ min: 3, max: 255 })
    .withMessage('Поле name должно быть длиной от 3 до 255 символов'),
  body('questions')
    .isArray({ min: 3 })
    .withMessage(
      '1. Вопросы должны приходить в body ввиде массива вида: [{question_text: string, answers: []}] 2. Вы не можете создать тест, у которого меньше 3 вопросов',
    ),
];
