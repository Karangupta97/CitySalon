import { Router } from "express";
import { getPool } from "@config/db";
import { env } from "@config/env";

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check route to verify server and database status
 * @access  Public
 */
router.get("/health", async (_req, res) => {
  let dbStatus = "UNKNOWN";
  let dbClient = null;

  try {
    if (env.DATABASE_URL || env.DB_HOST) {
      const pool = getPool();
      dbClient = await pool.connect();
      await dbClient.query("SELECT 1");
      dbStatus = "CONNECTED";
    } else {
      dbStatus = "NOT_CONFIGURED";
    }
  } catch (err: any) {
    dbStatus = `ERROR: ${err.message}`;
  } finally {
    if (dbClient) {
      dbClient.release();
    }
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
