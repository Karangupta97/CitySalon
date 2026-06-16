import pg from "pg";
import { env } from "@config/env";
import { logger } from "@utils/logger";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = env.DATABASE_URL;

    if (connectionString) {
      pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }, // Required for Supabase Postgres
        max: env.DB_POOL_MAX,
        min: env.DB_POOL_MIN,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else if (env.DB_HOST) {
      pool = new Pool({
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }, // Required for Supabase Postgres
        max: env.DB_POOL_MAX,
        min: env.DB_POOL_MIN,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      throw new Error("❌ Database configuration error: Neither DATABASE_URL nor DB_HOST environment variables are defined.");
    }

    pool.on("error", (err) => {
      logger.error("Unexpected error on idle database client:", err);
    });
  }
  return pool;
}

export async function connectDB(): Promise<void> {
  try {
    const client = await getPool().connect();
    // Verify connection is active
    await client.query("SELECT 1");
    client.release();
    logger.info("✅ Database connected successfully");
  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info("Database connection closed");
  }
}
