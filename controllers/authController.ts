import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import { Types } from 'mongoose';

const signToken = (id: Types.ObjectId, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    return next(new AppError('You need pass a JWT secret', 400));
  }
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id, next);

    res.status(201).json({
      status: 'sucess',
      token,
      data: {
        user: {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    //check if email and password exists
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    //check if user exists and password is correct
    //tem que usar o select porque o password está setado para não vir com requisições
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    //if everything ok, send token to client
    const token = signToken(user._id, next);
    res.status(200).json({
      status: 'sucess',
      token,
      data: {
        email,
      },
    });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there~
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log(token);
    }
    if (!token) {
      return next(
        new AppError('You are not logged in, please log in to get access', 401)
      );
    }
    // 2) verification token

    //3) check if user still exists

    //4 ) check if user changed password after token was issued

    next();
  }
);
