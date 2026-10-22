import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catch-async.js";
import { sendResponse } from "../../utils/send-response.js";
import * as reviewService from "./review-service.js";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const mentorId = req.user!.user_id;
  const { submissionId } = req.params;
  const result = await reviewService.createReview(mentorId, submissionId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Submission status successfully updated to ${req.body.status}`,
    data: result,
  });
});

export const getReviewsBySubmission = catchAsync(async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const result = await reviewService.getReviewsBySubmissionId(submissionId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Submission reviews retrieved successfully",
    data: result,
  });
});
