import { Request } from 'express';
import { Test } from '../../types';

type UpdateQueryValues =
  | [name: Test['name']]
  | [description: Test['name']]
  | [name: Test['name'], description: Test['description']];

interface TestRequest extends Request {
  body: Test;
}

interface UpdateTestRequestBody extends Partial<Test> {
  test_id: number;
}

interface UpdateTestRequest extends Request {
  body: UpdateTestRequestBody;
}

interface DeleteTestRequest extends Request {
  params: {
    test_id: string;
  };
}

export { TestRequest, UpdateTestRequest, DeleteTestRequest, UpdateQueryValues };
