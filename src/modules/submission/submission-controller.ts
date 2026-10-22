import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catch-async.js";
import { sendResponse } from "../../utils/send-response.js";
import * as submissionService from "./submission-service.js";

export const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const result = await submissionService.createSubmission(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project submitted successfully for review",
    data: result,
  });
});

export const getMySubmissions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.user_id;
  const result = await submissionService.getMySubmissions(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student submissions fetched successfully",
    data: result,
  });
});

export const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const { submissions, meta } = await submissionService.getAllSubmissions(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All submissions retrieved successfully",
    meta,
    data: submissions,
  });
});

export const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await submissionService.getSubmissionById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Submission details retrieved successfully",
    data: result,
  });
});
