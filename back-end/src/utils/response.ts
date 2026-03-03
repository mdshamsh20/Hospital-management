import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message = 'Error', errorCode = 'INTERNAL_ERROR', statusCode = 500, details = []) => {
  res.status(statusCode).json({
    success: false,
    errorCode,
    message,
    details,
  });
};
