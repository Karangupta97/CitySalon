import express, { Application } from "express";
import cors from "cors";
import { env } from "@config/env";
import { errorMiddleware } from "@middlewares/error.middleware";
import { loggerMiddleware } from "@middlewares/logger.middleware";
import { rateLimitMiddleware } from "@middlewares/rateLimit.middleware";
import v1Routes from "@api/v1";

export function createApp(): Application {
  const app = express();

  // Enable CORS with configured origins
  app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }));

  // Parse JSON payloads
  app.use(express.json({ limit: "10kb" }));

  // Parse URL-encoded payloads
  app.use(express.urlencoded({ extended: true }));

  // Request logging & rate limiting
  app.use(loggerMiddleware);
  app.use(rateLimitMiddleware);

  // Mount versioned API routes
  app.use("/api/v1", v1Routes);

  // Fallback simple root-level health check route
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Global centralized error handling middleware
  app.use(errorMiddleware);

  return app;
}
