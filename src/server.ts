import { Server } from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./utils/prisma.js";

let server: Server;

async function bootstrap() {
  try {
    server = app.listen(env.port, () => {
      console.log(`[server]: Review Dashboard API running on http://localhost:${env.port}`);
      console.log(`[server]: API Base URL: http://localhost:${env.port}/api/v1`);
      console.log(`[server]: Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error("[server]: Failed to start server:", error);
    process.exit(1);
  }
}

const exitHandler = () => {
  if (server) {
    server.close(async () => {
      console.log("[server]: Server closed successfully");
      await prisma.$disconnect();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("uncaughtException", (error) => {
  console.error("[server]: Uncaught Exception:", error);
  exitHandler();
});

process.on("unhandledRejection", (error) => {
  console.error("[server]: Unhandled Rejection:", error);
  exitHandler();
});

process.on("SIGTERM", () => {
  console.log("[server]: SIGTERM received");
  exitHandler();
});

process.on("SIGINT", () => {
  console.log("[server]: SIGINT received");
  exitHandler();
});

bootstrap();
