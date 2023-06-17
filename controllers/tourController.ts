import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import Tour from '../models/tourModel';

// export const checkId = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
//   val: string
// ) => {
//   console.log('o id é:', val);
//   if (!req.params.id) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   }

//   next();
// };

interface RequestWithTime extends Request {
  requestTime: string;
}
export const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'sucess',
      // requestTime: (req as RequestWithTime).requestTime,
      data: { tours },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',

      message: error,
    });
  }
};
export const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'sucess',
      id: req.params.id,
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};
export const createTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).send({
      status: 'sucess',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error,
    });
  }
};
export const updateTour = async (req: Request, res: Response) => {
  try {
    const updatedTour = await Tour.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).send({
      status: 'sucess',
      data: {
        updatedTour,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error,
    });
  }
};

export const deleteTour = (req: Request, res: Response) => {
  const string = req.params.id;
  const number = +'2';
  console.log(3 > +'2');
  console.log(typeof string);
  console.log(typeof number);
  res.send('ok');
};
