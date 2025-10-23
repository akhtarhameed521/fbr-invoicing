import { Request, Response, NextFunction } from "express";
import { ApiError } from "@helper/api-error.helper";
import { statusCode, ErrorResponse } from "@messages";

export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(statusCode.UnAuthorized, ErrorResponse.unAuthorized);
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(statusCode.Forbidden, ErrorResponse.forbidden);
    }

    next();
  };
};