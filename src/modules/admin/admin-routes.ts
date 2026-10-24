import { Router } from "express";
import { USER_ROLES } from "../../constants/user-roles.js";
import { userGuard } from "../../middlewares/user-guard.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import * as adminController from "./admin-controller.js";
import { createMentorValidationSchema } from "./admin-validation.js";

const router = Router();

// Ensure all endpoints in this route are restricted to ADMIN only
router.use(userGuard(USER_ROLES.ADMIN));

router.post(
  "/mentors",
  validateRequest(createMentorValidationSchema),
  adminController.createMentor
);

router.get("/mentors", adminController.getMentors);
router.delete("/mentors/:id", adminController.deleteMentor);
router.get("/stats", adminController.getAdminStats);
router.get("/users", adminController.getUsers);

export const adminRoutes = router;
