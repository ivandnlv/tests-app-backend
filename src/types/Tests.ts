interface Test {
  name: string;
  description: string;
}

interface Question {
  test_id: string;
  text: string;
}

interface Answer {
  question_id: string;
  text: string;
  is_correct: boolean;
}

export { Test, Question, Answer };
