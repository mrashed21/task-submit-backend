import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { handlePostgresPrismaError } from "./postgres-error.js";

// Global error handler middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorSources: Array<{ path: string; message: string }> = [];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1]?.toString() || "field",
      message: issue.message,
    }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const formattedDbError = handlePostgresPrismaError(err);
    statusCode = formattedDbError.statusCode;
    message = formattedDbError.message;
    if (formattedDbError.errorSources) {
      errorSources = formattedDbError.errorSources;
    }
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorSources: errorSources.length > 0 ? errorSources : undefined,
    stack: env.nodeEnv === "development" ? err.stack : undefined,
  });
};
