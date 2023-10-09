import { Request, Response } from 'express';
import db from '../../db';
import { Answer } from '../../types';

class AnswersController {
  createOneAnswer(req: Request, res: Response) {
    const { question_id, text, is_correct } = req.body;

    db.query(
      `INSERT INTO answers (question_id, text, is_correct) VALUES (?, ?, ?)`,
      [question_id, text, is_correct],
      (err) => {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        } else {
          return res.json({
            message: 'success',
          });
        }
      },
    );
  }

  createManyAnswers(req: Request, res: Response) {
    const { answers }: { answers: Answer[] } = req.body;

    const queryData = answers.map((answer) => [
      answer.question_id,
      answer.answer_text,
      answer.is_correct,
    ]);

    db.query(
      `
		INSERT INTO answers (question_id, text, is_correct)
		VALUES ?
	`,
      [queryData],
      (err) => {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        } else {
          return res.json({
            message: 'success',
          });
        }
      },
    );
  }

  getAnswersByQuestionId(req: Request, res: Response) {
    const { question_id } = req.params;

    db.query('SELECT * FROM answers WHERE question_id = ?', [question_id], (err, result) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      } else {
        return res.json(result);
      }
    });
  }

  updateAnswer(req: Request, res: Response) {
    const { answer_id } = req.params;
    const { is_correct, text } = req.body;

    if (!answer_id) {
      return res.status(400).json({
        message: 'answer_id is required!',
      });
    }

    let sqlQuery = 'UPDATE answers SET ';
    let sqlValues: any[] = [];

    if (text) {
      sqlQuery += 'answer_text = ?, ';
      sqlValues.push(text);
    }

    if (req.body.hasOwnProperty('is_correct')) {
      sqlQuery += 'is_correct = ?, ';
      sqlValues.push(is_correct);
    }

    sqlValues.push(answer_id);
    sqlQuery = sqlQuery.slice(0, -2) + ' WHERE answer_id = ?';

    db.query({ sql: sqlQuery, values: sqlValues }, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
          sqlQuery,
          sqlValues,
        });
      } else {
        return res.json({
          message: 'success',
        });
      }
    });
  }

  deleteAnswer(req: Request, res: Response) {
    const { answer_id } = req.params;

    db.query(`DELETE FROM answers WHERE answer_id = ?`, [answer_id], (err) => {
      if (err) {
        return res.status(400).json({
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

export const answersController = new AnswersController();
