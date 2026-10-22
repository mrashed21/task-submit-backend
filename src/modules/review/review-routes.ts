import { Router } from "express";
import { USER_ROLES } from "../../constants/user-roles.js";
import { userGuard } from "../../middlewares/user-guard.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import * as reviewController from "./review-controller.js";
import { reviewSubmissionValidationSchema } from "./review-validation.js";

const router = Router();

router.post(
  "/:submissionId",
  userGuard(USER_ROLES.MENTOR, USER_ROLES.ADMIN),
  validateRequest(reviewSubmissionValidationSchema),
  reviewController.createReview
);

router.get("/:submissionId", userGuard(), reviewController.getReviewsBySubmission);

export const reviewRoutes = router;
