import fs from 'fs';
import { NextFunction, Request, Response } from 'express';

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);
export const checkId = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: string
) => {
  console.log('o id é:', val);
  if (!req.params.id) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  next();
};

export const checkBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid body',
    });
  }
  next();
};

interface RequestWithTime extends Request {
  requestTime: string;
}
export const getAllTours = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'sucess',
    requestTime: (req as RequestWithTime).requestTime,
    data: { tours },
  });
};
export const getTour = (req: Request, res: Response) => {
  console.log(req.params);
  res.status(200).json({
    status: 'sucess',
    id: req.params.id,
    data: { tours },
  });
};
export const createTour = (req: Request, res: Response) => {
  res.send(req.body);
};
export const updateTour = (req: Request, res: Response) => {
  const string = req.params.id;
  const number = +'2';
  console.log(3 > +'2');
  console.log(typeof string);
  console.log(typeof number);
  res.send('ok');
};

export const deleteTour = (req: Request, res: Response) => {
  const string = req.params.id;
  const number = +'2';
  console.log(3 > +'2');
  console.log(typeof string);
  console.log(typeof number);
  res.send('ok');
};
