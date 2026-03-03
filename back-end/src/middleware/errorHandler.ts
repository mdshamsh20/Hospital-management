import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  errorCode?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${req.method} ${req.url}`, err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';
  let details = err.details || [];

  if (err instanceof ZodError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Invalid input data';
    details = err.issues.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle Prisma specific errors
  if (err.name === 'PrismaClientKnownRequestError') {
      const prismaErr = err as any;
      if (prismaErr.code === 'P2002') { // Unique constraint
          statusCode = 409;
          message = `Duplicate entry: A record with this ${prismaErr.meta?.target || 'value'} already exists.`;
          errorCode = 'CONFLICT';
      } else if (prismaErr.code === 'P2025') { // Not found
          statusCode = 404;
          message = 'The requested record was not found.';
          errorCode = 'NOT_FOUND';
      } else {
          statusCode = 400;
          message = 'Database operation failed.';
          errorCode = 'DATABASE_ERROR';
      }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    details: details.length > 0 ? details : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
