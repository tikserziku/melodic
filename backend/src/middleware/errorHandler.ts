import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
  code?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as ErrorWithStatus;
  error.status = 404;
  next(error);
};

export const errorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || err.code || 500;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};