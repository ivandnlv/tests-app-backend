import { Answer } from './Answer';
import { Question } from './Question';

interface TestInfo {
  name: string;
  description: string;
}

interface TestQuestion {
  question: Question;
  answers: Answer[] | null;
}

interface Test {
  test_id: string;
  name: string;
  description: string;
  questions: TestQuestion[];
}

export { TestInfo, Test, TestQuestion };
