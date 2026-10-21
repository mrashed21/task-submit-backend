import { Router } from "express";
import { userGuard } from "../../middlewares/user-guard.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import * as authController from "./auth-controller.js";
import { loginValidationSchema, registerValidationSchema } from "./auth-validation.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.register
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  authController.login
);

router.get("/me", userGuard(), authController.getMe);

export const authRoutes = router;
