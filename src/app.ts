import cors from "cors";
import express, { Application, Request, Response } from "express";
import { env } from "./config/env.js";
import { globalErrorHandler } from "./middlewares/global-error.js";
import { notFoundHandler } from "./middlewares/not-found.js";
import { apiRateLimiter } from "./middlewares/rate-limiter.js";
import { apiRoutes } from "./routes/api-routes.js";

const app: Application = express();

app.use(
  cors({
    origin: [env.corsOrigin, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy and running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Project Submission & Review Dashboard API",
    version: "1.0.0",
    docs: "/api/v1",
  });
});

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
