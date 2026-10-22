import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catch-async.js";
import { sendResponse } from "../../utils/send-response.js";
import * as statService from "./stat-service.js";

export const getStatistics = catchAsync(async (_req: Request, res: Response) => {
  const result = await statService.getDashboardStatistics();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard statistics aggregated successfully",
    data: result,
  });
});
