import { Response } from "express";

interface ResponseData<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data?: T;
}

export const sendResponse = <T>(res: Response, payload: ResponseData<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    statusCode: payload.statusCode,
    message: payload.message || (payload.success ? "Success" : "Error"),
    meta: payload.meta,
    data: payload.data,
  });
};
