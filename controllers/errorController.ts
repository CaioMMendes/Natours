import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
interface Err extends Error {
  status?: string;
  statusCode?: number;
  isOperational?: boolean;
  path?: string;
  value?: string;
  keyValue?: {
    name: string;
  };
  errmsg?: string;
  code?: number;
  errors?: any;
  //   {
  //     name: string;
  //   };
}

interface Element {
  message: string;
}

const handleCastErrorDB = (err: Err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicatedFieldsErrorDB = (err: Err) => {
  //como eu faria
  const message = `Duplicate field value:${err.keyValue?.name}. Please use another value!`;
  //   const message = `Duplicate field value:${value}. Please use another value!`;

  return new AppError(message, 400);
};
const handleValidationErrorDB = (err: Err) => {
  const errors: string[] = Object.values(
    err.errors as Record<string, { message: string }>
  ).map((el: { message: string }) => {
    return el.message;
  });
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err: Err, res: Response) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};
const sendErrorProd = (err: Err, res: Response) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
  });
};
export default (err: Err, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //cria outra variável porque não é uma boa prática sobrescrever coisas

    let error = { ...err, name: err.name, message: err.message };
    // res.status(err.statusCode).json({
    //   err: err,
    //   error: error,
    // });
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicatedFieldsErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};
