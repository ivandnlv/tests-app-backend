import { Request, Response } from 'express';
import {
  CreateTestRequest,
  GetTestQueryResult,
  GetTestQueryOutput,
  UpdateTestRequest,
  DeleteTestRequest,
} from './tests.types';
import db from '../../db';
import { Test } from '../../types';

class TestsController {
  createTest(req: CreateTestRequest, res: Response) {
    const { name, description } = req.body;
    db.query(`INSERT INTO tests (name, description) VALUES (?, ?);`, [name, description], (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        return res.json({
          message: 'Success',
        });
      }
    });
  }
  getAllTests(req: Request, res: Response) {
    try {
      db.query('SELECT * FROM tests', (err, rows) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        } else {
          return res.json(rows);
        }
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  getOneTest(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const isAll = req.query.hasOwnProperty('all');

      if (isAll) {
        db.query(
          `
          SELECT tests.name, tests.description, questions.question_text, answers.answer_text, answers.is_correct
          FROM tests
          JOIN questions ON tests.test_id = questions.test_id
          JOIN answers ON questions.question_id = answers.question_id
          WHERE tests.test_id = ?;
        `,
          [id],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            } else {
              const testData: GetTestQueryResult[] = result;

              const { name, description } = testData[0];

              let obj: GetTestQueryOutput = {
                name,
                description,
                questions: [],
              };

              const questionsCount: number = [
                ...new Set(testData.map((item) => item.question_text)),
              ].length;

              const questions: GetTestQueryOutput['questions'] = Array(questionsCount).fill({
                text: testData[0].question_text,
                answers: [],
              });

              let i = 0;
              testData.forEach((testItem) => {
                if (questions[i].text) {
                  questions[i].answers.push(testItem.answer_text);
                } else {
                  i += 1;
                  questions[i].text = testItem.question_text;
                  questions[i].answers.push(testItem.answer_text);
                }
              });

              obj.questions = questions;

              return res.json(obj);
            }
          },
        );
      } else {
        db.query('SELECT * FROM tests WHERE test_id = ?', [id], (err, result) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          } else {
            return res.json(result[0]);
          }
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message,
        });
      } else {
        return res.status(500).json(error);
      }
    }
  }

  updateTest(req: UpdateTestRequest, res: Response) {
    const { name, description, test_id } = req.body;

    if (!test_id) {
      return res.status(400).json({
        message: 'test_id is required!',
      });
    }

    let sqlQuery = `UPDATE tests SET `;
    let queryValues: any[] = [];

    if (name) {
      sqlQuery += `name = ?, `;
      queryValues.push(name);
    }

    if (description) {
      sqlQuery += `description = ?, `;
      queryValues.push(description);
    }

    queryValues.push(test_id);

    sqlQuery = sqlQuery.slice(0, -2) + ' WHERE test_id = ?';

    db.query({ sql: sqlQuery, values: queryValues }, (err, result) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        return res.json({
          message: 'success',
          result,
        });
      }
    });
  }

  deleteTest(req: DeleteTestRequest, res: Response) {
    const { test_id } = req.params;

    db.query(
      `
      DELETE FROM tests WHERE test_id = ?
    `,
      [test_id],
      (err, result) => {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        } else {
          return res.json({
            message: 'success',
            result,
          });
        }
      },
    );
  }
}

export const testsController = new TestsController();
