import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async functions to handle promise rejections and pass them to error middleware.
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
