import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@utils/token";
import { UnauthorizedError, ForbiddenError } from "@errors/HttpError";

/**
 * Verifies the Bearer JWT and attaches the decoded payload to req.user.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("No authentication token provided.");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new UnauthorizedError("Invalid or expired authentication token.");
  }

  req.user = decoded;
  next();
};

/**
 * Requires the authenticated user to have the 'owner' role.
 * Must be used AFTER `authenticate`.
 */
export const requireOwner = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required.");
  }
  if (req.user.role !== "owner" && req.user.role !== "admin") {
    throw new ForbiddenError("Access denied. Owner privileges required.");
  }
  next();
};
