import { RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API route not found: [${req.method}] ${req.originalUrl}`,
  });
};
