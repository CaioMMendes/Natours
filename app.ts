import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import tourRoutes from './routes/tourRoutes';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
// const tourRoutes = require('./routes/tourRoutes');
// const userRoutes = require('./routes/userRoutes');

//tem que colocar antes de tudo porque se não ele não pega as coisas
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION 💥');
  console.log(err.name, err.message);
});
interface RequestWithTime extends Request {
  requestTime: any;
}
interface Err extends Error {
  status?: string;
  statusCode?: number;
}

dotenv.config({ path: './config.env' });

const app = express();

//Midlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithTime).requestTime = new Date().toISOString();
  next();
});

//Route handlers

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id?', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//Routes
app.use('/api/v1/tours', tourRoutes);

app.use('/api/v1/users', userRoutes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  //o err.message pega o valor que esta dentro do parenteses do Error
  // const err: Err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

//Server
// export default app;
export { app };
