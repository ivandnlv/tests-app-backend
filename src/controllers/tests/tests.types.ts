import { Request } from 'express';
import { Test } from '../../types';

interface TestRequest extends Request {
  body: Test;
}

interface UpdateTestRequestBody extends Test {
  id: number;
}

interface UpdateTestRequest extends Request {
  body: UpdateTestRequestBody;
}

interface DeleteTestRequest extends Request {
  body: {
    id: string;
  };
}

export { TestRequest, UpdateTestRequest, DeleteTestRequest };
