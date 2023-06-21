import { Request, Response, NextFunction } from 'express';

interface Err extends Error {
  status?: string;
  statusCode?: number;
}

export default (err: Err, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
