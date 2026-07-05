import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(422).json({ message: "Validation failed", issues: error.flatten() });
  }

  const status = typeof error.status === "number" ? error.status : 500;
  const message = status === 500 ? "Internal server error" : error.message;

  return res.status(status).json({ message });
};
