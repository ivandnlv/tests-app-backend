import { Request, Response } from 'express';
import { Question } from '../../types';
import { UpdateQuestionBody } from './questions.types';
import db from '../../db';

class QuestionsController {
  getQuestionsByTestId(req: Request, res: Response) {
    const { testId } = req.params;

    db.query(`SELECT * FROM questions WHERE test_id = ?`, [testId], (err, result) => {
      if (err) {
        res.status(400).json({
          message: err.message,
        });
      } else {
        res.json({
          result,
        });
      }
    });
  }

  createQuestion(req: Request, res: Response) {
    const { testId, text } = req.body;

    db.query(`INSERT INTO questions (test_id, text) VALUES (?, ?)`, [testId, text], (err) => {
      if (err) {
        res.status(400).json({
          message: err.message,
        });
      } else {
        res.json({
          status: 'success',
        });
      }
    });
  }

  createManyQuestions(req: Request, res: Response) {
    const { questions }: { questions: Question[] } = req.body;

    const queryData = questions.map((question) => [question.test_id, question.text]);

    db.query(
      `
		INSERT INTO questions (test_id, text)
		VALUES ?
	`,
      [queryData],
      (err) => {
        if (err) {
          res.status(400).json({
            message: err.message,
          });
        } else {
          res.json({
            status: 'success',
          });
        }
      },
    );
  }

  updateQuestion(req: Request, res: Response) {
    const { text, question_id }: UpdateQuestionBody = req.body;

    db.query(
      `
      UPDATE questions SET text = ? WHERE question_id = ?
      `,
      [text, question_id],
      (err) => {
        if (err) {
          res.status(400).json({
            message: err.message,
          });
        } else {
          res.json({
            status: 'success',
          });
        }
      },
    );
  }

  deleteQuestion(req: Request, res: Response) {
    const { questionId } = req.body;

    db.query(
      `
		DELETE FROM questions WHERE question_id = ?
	`,
      [questionId],
      (err) => {
        if (err) {
          res.status(400).json({
            message: err.message,
          });
        } else {
          res.json({
            message: 'success',
          });
        }
      },
    );
  }

  deleteAllQuestions(req: Request, res: Response) {
    const { test_id } = req.body;

    db.query(
      `
		DELETE FROM questions WHERE test_id = ?
	`,
      [test_id],
      (err) => {
        if (err) {
          res.status(400).json({
            message: err.message,
          });
        } else {
          res.json({
            message: 'success',
          });
        }
      },
    );
  }
}

export const questionsController = new QuestionsController();
