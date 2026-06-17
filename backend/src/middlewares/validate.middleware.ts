import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { BadRequestError } from "@errors/HttpError";

/**
 * Express middleware to validate incoming request schemas using Zod.
 */
export const validate = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues.map((e) => `${e.message}`);
        next(new BadRequestError(messages.join(", ")));
      } else {
        next(err);
      }
    }
  };
