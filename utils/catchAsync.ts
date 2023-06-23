import { NextFunction, Response, Request } from 'express';

const catchAsync = <T extends (...args: any[]) => Promise<any>>(func: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
};

export default catchAsync;
