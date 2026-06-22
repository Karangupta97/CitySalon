import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@config/env";
import { logger } from "@utils/logger";
import crypto from "crypto";

export class StorageService {
  private static s3Client: S3Client | null = null;

  private static getClient(): S3Client | null {
    if (
      !env.AWS_ACCESS_KEY_ID ||
      env.AWS_ACCESS_KEY_ID === "your_access_key" ||
      !env.AWS_SECRET_ACCESS_KEY ||
      env.AWS_SECRET_ACCESS_KEY === "your_secret_key"
    ) {
      logger.warn("⚠️ AWS S3 credentials not fully configured in env variables. Running in mock upload mode.");
      return null;
    }

    if (!this.s3Client) {
      this.s3Client = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
    return this.s3Client;
  }

  /**
   * Uploads a base64 encoded image to AWS S3.
   * If credentials are missing, falls back to returning a placeholder mockup URL.
   */
  static async uploadBase64(base64Data: string, filename: string, contentType: string): Promise<string> {
    try {
      // Clean prefix if it is present (e.g. data:image/jpeg;base64,...)
      const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Content, "base64");

      // Generate a unique file name to avoid collisions
      const fileExtension = filename.split(".").pop() || "jpg";
      const uniqueId = crypto.randomBytes(16).toString("hex");
      const s3Key = `salons/${uniqueId}.${fileExtension}`;

      const client = this.getClient();
      if (!client) {
        // Fallback mockup image URL
        logger.info("Mock upload success: returning placeholder image URL");
        // Return a premium looking unsplash placeholder matching the category
        return `https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80`;
      }

      const bucketName = env.AWS_S3_BUCKET_NAME;

      logger.info(`Uploading image to S3: bucket=${bucketName}, key=${s3Key}`);
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
          Body: buffer,
          ContentType: contentType,
        })
      );

      // Return proxy URL pointing to our backend public route
      const publicUrl = `${env.BACKEND_URL}/api/v1/public/images/${s3Key}`;
      logger.info(`Upload successful: ${publicUrl}`);
      return publicUrl;
    } catch (error: any) {
      logger.error("❌ S3 Upload failed:", error);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  /**
   * Fetches an object stream from S3 for streaming to client.
   */
  static async getObjectStream(s3Key: string) {
    try {
      const client = this.getClient();
      if (!client) return null;

      const bucketName = env.AWS_S3_BUCKET_NAME;
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });

      return await client.send(command);
    } catch (error: any) {
      logger.error(`❌ S3 getObject failed for key ${s3Key}:`, error);
      throw error;
    }
  }
}
