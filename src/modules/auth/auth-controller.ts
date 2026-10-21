import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catch-async.js";
import { sendResponse } from "../../utils/send-response.js";
import * as authService from "./auth-service.js";

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerStudent(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Student account registered successfully",
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const result = await authService.getCurrentUser(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});
