import { Router } from "express";
import { authRoutes } from "../modules/auth/auth-routes.js";
import { reviewRoutes } from "../modules/review/review-routes.js";
import { statRoutes } from "../modules/stat/stat-routes.js";
import { submissionRoutes } from "../modules/submission/submission-routes.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/submissions",
    route: submissionRoutes,
  },
  {
    path: "/reviews",
    route: reviewRoutes,
  },
  {
    path: "/stats",
    route: statRoutes,
  },
];

moduleRoutes.forEach((routeItem) => {
  router.use(routeItem.path, routeItem.route);
});

export const apiRoutes = router;
