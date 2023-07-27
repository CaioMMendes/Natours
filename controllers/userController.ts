import { Request, Response } from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();

  res.status(200).json({
    status: 'sucess',
    data: {
      users,
    },
  });
});
export const getUser = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'sucess',
  });
};
export const createUser = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'sucess',
  });
};
export const updateUser = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'sucess',
  });
};
export const deleteUser = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'sucess',
  });
};
