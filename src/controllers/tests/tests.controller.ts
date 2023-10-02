import { Request, Response } from 'express';
import { DeleteTestRequest, TestRequest, UpdateTestRequest } from './tests.types';
import db from '../../db';

class TestsController {
  createTest(req: TestRequest, res: Response) {
    const { name, description } = req.body;
    db.query(`INSERT INTO tests (name, description) VALUES (?, ?);`, [name, description], (err) => {
      if (err) {
        res.status(400).json({
          message: err.message,
        });
      } else {
        res.json({
          message: 'Success',
        });
      }
    });
  }
  getAllTests(req: Request, res: Response) {
    db.query('SELECT * FROM tests', (err, rows) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
      } else {
        res.json(rows);
      }
    });
  }

  getOneTest(req: Request, res: Response) {
    const { id } = req.params;

    db.query('SELECT * FROM tests WHERE test_id = ?', [id], (err, rows) => {
      if (err) {
        res.status(400).json({
          message: err.message,
          rows,
        });
      } else {
        res.json(rows);
      }
    });
  }

  updateTest(req: UpdateTestRequest, res: Response) {
    const { name, description, id } = req.body;
    db.query(
      `UPDATE tests SET name = ?, description = ? where test_id = ?`,
      [name, description, id],
      (err, result) => {
        if (err) {
          res.status(400).json({
            message: err.message,
          });
        } else {
          res.json({
            message: 'success',
            result,
          });
        }
      },
    );
  }

  deleteTest(req: DeleteTestRequest, res: Response) {
    const { id } = req.body;

    db.query(
      `
      DELETE FROM tests WHERE test_id = ?
    `,
      [id],
      (err, result) => {
        if (err) {
          res.status(400).json({
            message: err.message,
          });
        } else {
          res.json({
            message: 'success',
            result,
          });
        }
      },
    );
  }
}

export const testsController = new TestsController();
