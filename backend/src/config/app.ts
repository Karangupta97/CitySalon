import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "@config/env";
import { errorMiddleware } from "@middlewares/error.middleware";
import { loggerMiddleware } from "@middlewares/logger.middleware";
import { rateLimitMiddleware } from "@middlewares/rateLimit.middleware";
import v1Routes from "@api/v1";

export function createApp(): Application {
  const app = express();

  // Security headers
  app.use(helmet());

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

  // Root-level health check route showing server and database status
  app.get("/health", async (_req, res) => {
    let dbStatus = "UNKNOWN";

    try {
      if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
        const response = await fetch(`${env.SUPABASE_URL}/rest/v1/`, {
          method: "GET",
          headers: {
            "apikey": env.SUPABASE_ANON_KEY,
          },
        });

        if (response.ok) {
          dbStatus = "CONNECTED";
        } else {
          dbStatus = `ERROR: Status ${response.status} - ${response.statusText}`;
        }
      } else {
        dbStatus = "NOT_CONFIGURED";
      }
    } catch (err: any) {
      dbStatus = `ERROR: ${err.message}`;
    }

    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus
    });
  });

  // Global centralized error handling middleware
  app.use(errorMiddleware);

  return app;
}
