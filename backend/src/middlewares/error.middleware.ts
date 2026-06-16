import { Request, Response, NextFunction } from "express";
import { AppError } from "@errors/AppError";
import { sendError } from "@utils/response";
import { logger } from "@utils/logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn("Operational error", {
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
    });
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Unknown/unexpected error
  logger.error("Unexpected error", { error: err.stack, path: req.path });
  sendError(res, "Internal Server Error", 500);
};
