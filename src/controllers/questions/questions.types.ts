import { Question } from '../../types';

interface UpdateQuestionBody extends Question {
  question_id: string;
}

export { UpdateQuestionBody };
