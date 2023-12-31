import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import Tour from '../models/tourModel';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
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

export const aliasTopTours = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

export const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //build query

    //filtering
    // const queryObj = { ...req.query };
    // // tem que excluir porque se não na hora de buscar o tour ele vai buscar um
    // // parametro que não tem nos objtos, como sort, limit...
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach((element) => delete queryObj[element]);

    // //advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));

    //sorting
    // if (req.query.sort && typeof req.query.sort === 'string') {
    //   console.log(req.query.sort);
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    //field limiting
    // if (req.query.fields && typeof req.query.fields === 'string') {
    //   console.log(req.query.fields);
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    //pagination
    // const page = req.query.page ? +req.query.page : 1;
    // const limit = req.query.limit ? +req.query.limit : 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error('This page does not exists');
    //   }
    // }

    //execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;

    //send response
    res.status(200).json({
      status: 'sucess',
      results: tours.length,
      // requestTime: (req as RequestWithTime).requestTime,
      data: { tours },
    });
  }
);
export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return next(new AppError('No tour found with that Id', 404));
    }
    res.status(200).json({
      status: 'sucess',
      // id: req.params.id,
      data: { tour },
    });
  }
);

export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.create(req.body);
    res.status(201).send({
      status: 'sucess',
      data: {
        tour,
      },
    });
  }
);
export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedTour = await Tour.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedTour) {
      return next(new AppError('No tour found with that Id', 404));
    }
    res.status(201).send({
      status: 'sucess',
      data: {
        updatedTour,
      },
    });
  }
);

export const deleteTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tour = await Tour.deleteOne({ _id: req.params.id });
  if (!tour) {
    return next(new AppError('No tour found with that Id', 404));
  }
  res.status(204).send({
    status: 'sucess',
    data: null,
  });
};

export const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgRating: 1,
        },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);
    res.status(200).json({
      status: 'sucess',
      id: req.params.id,
      data: { stats },
    });
  }
);

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: {
            $push: {
              name: '$name',
              price: '$price',
              ratingsAverage: '$ratingsAverage',
            },
          },
        },
      },
      { $addFields: { month: '$_id' } },
      {
        $project: {
          _id: 0,
        },
      },
      { $sort: { numTourStarts: -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      status: 'sucess',
      results: plan.length,
      id: req.params.id,
      data: { plan },
    });
  }
);
