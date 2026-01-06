import { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: result.error.errors,
      });
    }
    req.body = result.data;
    next();
  };
}
