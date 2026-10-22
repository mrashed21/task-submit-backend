import { Router } from "express";
import { USER_ROLES } from "../../constants/user-roles.js";
import { submissionRateLimiter } from "../../middlewares/rate-limiter.js";
import { userGuard } from "../../middlewares/user-guard.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import * as submissionController from "./submission-controller.js";
import {
  createSubmissionValidationSchema,
  getSubmissionsQuerySchema,
} from "./submission-validation.js";

const router = Router();

router.post(
  "/",
  userGuard(USER_ROLES.STUDENT),
  submissionRateLimiter,
  validateRequest(createSubmissionValidationSchema),
  submissionController.createSubmission
);

router.get(
  "/my-submissions",
  userGuard(USER_ROLES.STUDENT),
  submissionController.getMySubmissions
);

router.get(
  "/",
  userGuard(USER_ROLES.MENTOR, USER_ROLES.ADMIN),
  validateRequest(getSubmissionsQuerySchema),
  submissionController.getAllSubmissions
);

router.get(
  "/:id",
  userGuard(),
  submissionController.getSubmissionById
);

export const submissionRoutes = router;
