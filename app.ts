import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import tourRoutes from './routes/tourRoutes';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
// const tourRoutes = require('./routes/tourRoutes');
// const userRoutes = require('./routes/userRoutes');
interface RequestWithTime extends Request {
  requestTime: any;
}

dotenv.config({ path: './config.env' });

const app = express();

//Midlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('oie');
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

//Server
// export default app;
export { app };
