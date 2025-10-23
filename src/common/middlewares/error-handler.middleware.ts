import { ApiError } from "@helper/api-error.helper";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: err.success,
      message: err.errorMessage,
      data: err.data,
    });
    return;
  }

  res.status(500).json({
    statusCode: 500,
    success: false,
    message: "Internal server error",
    data: null,
  });
};