import { createApp } from "@config/app";
import { connectDB } from "@config/db";
import { env } from "@config/env";
import { logger } from "@utils/logger";

async function bootstrap(): Promise<void> {
  // Connect to database
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // Graceful shutdown helper
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      const { disconnectDB } = await import("@config/db");
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection", { reason });
    process.exit(1);
  });
}

bootstrap();
