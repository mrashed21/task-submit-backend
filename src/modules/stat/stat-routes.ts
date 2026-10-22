import { Router } from "express";
import { USER_ROLES } from "../../constants/user-roles.js";
import { userGuard } from "../../middlewares/user-guard.js";
import * as statController from "./stat-controller.js";

const router = Router();

router.get(
  "/dashboard",
  userGuard(USER_ROLES.MENTOR, USER_ROLES.ADMIN),
  statController.getStatistics
);

export const statRoutes = router;
