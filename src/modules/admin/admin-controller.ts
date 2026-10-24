import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catch-async.js";
import { sendResponse } from "../../utils/send-response.js";
import * as adminService from "./admin-service.js";

export const createMentor = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.createMentor(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Mentor account created successfully",
    data: result,
  });
});

export const getMentors = catchAsync(async (_req: Request, res: Response) => {
  const result = await adminService.getAllMentors();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mentors retrieved successfully",
    data: result,
  });
});

export const deleteMentor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.deleteMentor(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mentor removed successfully",
    data: result,
  });
});

export const getAdminStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await adminService.getAdminStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin statistics retrieved successfully",
    data: result,
  });
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const role = req.query.role as string | undefined;
  const result = await adminService.getAllUsers(role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});
