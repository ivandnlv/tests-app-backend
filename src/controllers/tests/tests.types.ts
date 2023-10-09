import { Request } from 'express';
import { Answer, Question, Test } from '../../types';

interface CreateTestRequest extends Request {
  body: {
    name: Test['name'];
    description: Test['description'];
  };
}

interface GetTestQueryResult {
  name: Test['name'];
  description: Test['description'];
  question_text: Question['question_text'];
  answer_text: Answer['answer_text'];
  is_correct: Answer['is_correct'];
}

interface GetTestQueryOutput {
  name: Test['name'];
  description: Test['name'];
  questions: {
    text: Question['question_text'] | null;
    answers: Answer['answer_text'][];
  }[];
}

interface UpdateTestRequest extends Request {
  body: {
    name: Test['name'];
    description: Test['description'];
    test_id: Test['test_id'];
  };
}

interface DeleteTestRequest extends Request {
  params: {
    test_id: string;
  };
}

export {
  CreateTestRequest,
  GetTestQueryResult,
  GetTestQueryOutput,
  UpdateTestRequest,
  DeleteTestRequest,
};
