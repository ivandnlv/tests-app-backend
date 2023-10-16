import { NextFunction, Request, Response } from 'express';
import {
  CreateTestRequest,
  GetTestQueryResult,
  GetTestQueryOutput,
  UpdateTestRequest,
  DeleteTestRequest,
} from './tests.types';
import db from '../../db';
import { validationResult } from 'express-validator';
import { BadRequest, DefaultError } from '../../utils';

class TestsController {
  createTest(req: CreateTestRequest, res: Response, next: NextFunction) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map((err) => err.msg);
      throw new BadRequest(errors[0]);
    }
    try {
      const { name, description, questions } = req.body;

      db.query(
        'INSERT INTO tests (name, description) VALUES (?, ?)',
        [name, description],
        (err, result) => {
          if (err) {
            return next(new DefaultError(err.message));
          } else {
            const testId = result.insertId;

            let questionsIndex = 0;
            for (const question of questions) {
              const { answers, question_text } = question;
              db.query(
                'INSERT INTO questions (question_text, test_id) VALUES (?, ?)',
                [question_text, testId],
                (err, questionResult) => {
                  if (err) {
                    db.query('DELETE FROM tests WHERE test_id = ?', [testId]);
                    return next(new DefaultError(err.message));
                  } else {
                    const questionId = questionResult.insertId;
                    for (const answer of answers) {
                      const { answer_text, is_correct } = answer;

                      db.query(
                        'INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)',
                        [questionId, answer_text, is_correct],
                        (err) => {
                          if (err) {
                            db.query('DELETE FROM questions WHERE question_id = ?', [questionId]);
                            db.query('DELETE FROM tests WHERE test_id = ?', [testId]);
                            return next(new DefaultError(err.message));
                          }
                        },
                      );
                    }
                  }
                },
              );
              questionsIndex++;
              if (questionsIndex === questions.length) {
                return res.json({
                  status: 'success',
                });
              }
            }
          }
        },
      );
    } catch (error) {
      next(error);
    }
  }
  async getAllTests(req: Request, res: Response) {
    try {
      const { limit = 10, page = 1, order_by = 'test_id' } = req.query;

      const limitParam = Number(limit);
      const pageParam = Number(page) - 1;
      const offset = pageParam * Number(limit);

      let testsCount = 10;
      let allPagesCount = 0;

      db.query('SELECT COUNT(*) as tests_count FROM tests;', async (err, result) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        } else {
          testsCount = await result[0].tests_count;
          allPagesCount = Math.ceil(testsCount / limitParam);
        }
      });

      db.query(
        `
        SELECT * 
        FROM tests
        ORDER BY ?
        LIMIT ?
        OFFSET ?
      `,
        [order_by, limitParam, offset],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
              query: err.sql,
            });
          } else {
            if (pageParam > allPagesCount) {
              return res.status(404).json({
                message: 'Запрашиваемая страница не найдена',
              });
            }

            return res.json({
              tests: result,
              currentPage: page,
              allTestsCount: testsCount,
              allPagesCount,
              limit,
            });
          }
        },
      );
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

              if (!testData.length)
                return res.status(404).json({ message: 'Такого теста не существует' });

              if (testData[0]?.answer_text) {
                const { name, description } = testData[0];

                let obj: GetTestQueryOutput = {
                  name,
                  description,
                  questions: [],
                };

                const questionsCount: number = [
                  ...new Set(testData.map((item) => item.question_text)),
                ].length;

                const questions: GetTestQueryOutput['questions'] = [];

                for (let i = 0; i < questionsCount; i++) {
                  questions.push({ text: null, answers: [] });
                }

                let i = 0;
                testData.forEach((testItem) => {
                  if (!questions[i].text) {
                    questions[i].text = testItem.question_text;
                    questions[i].answers.push(testItem.answer_text);
                  } else if (testItem.question_text === questions[i].text) {
                    questions[i].answers.push(testItem.answer_text);
                  } else if (testItem.question_text !== questions[i].text) {
                    i += 1;
                    questions[i].answers = [];
                    questions[i].text = testItem.question_text;
                    questions[i].answers.push(testItem.answer_text);
                  }
                });

                obj.questions = questions;

                return res.json(obj);
              } else {
                return res.json({
                  name: testData[0].name,
                  description: testData[0].description,
                  questions: [],
                });
              }
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
            if (result.length) {
              return res.json(result[0]);
            } else {
              return res.status(404).json({ message: 'Тест не найден' });
            }
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

    db.query({ sql: sqlQuery, values: queryValues }, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        return res.json({
          message: 'success',
        });
      }
    });
  }

  deleteTest(req: DeleteTestRequest, res: Response) {
    try {
      const { test_id } = req.params;

      db.query('SELECT question_id FROM questions WHERE test_id = ?', [test_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        } else {
          let questionsIds: { question_id: string }[] = result;
          const ids = questionsIds.map((item) => item.question_id);
          let questionsIndex = 0;
          for (const questionId of ids) {
            db.query('DELETE FROM answers WHERE question_id = ?', [questionId], (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              }
            });
            db.query('DELETE FROM questions WHERE question_id = ?', [questionId], (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              }
            });
            questionsIndex++;
          }
          if (questionsIndex === ids.length) {
            db.query('DELETE FROM tests WHERE test_id = ?', [test_id], (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              } else {
                return res.json({
                  status: 'success',
                });
              }
            });
          }
        }
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export const testsController = new TestsController();
