import { Router } from "express";
import { env } from "@config/env";

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check route to verify server and database status
 * @access  Public
 */
router.get("/health", async (_req, res) => {
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

  res.status(200).json({
    status: "OK",
    message: "Server is running smoothly",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus
  });
});

/**
 * @route   GET /api/v1/
 * @desc    Welcome / greeting endpoint
 * @access  Public
 */
router.get("/", (_req, res) => {
  res.status(200).json({
    message: "Welcome to the CitySalon API — organic luxury, gentle rituals, and ethical beauty.",
    version: "1.0.0",
  });
});

export default router;
