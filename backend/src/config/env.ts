import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000").transform(Number),

  // Supabase REST client credentials
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // SMTP configuration (Amazon SES via Nodemailer)
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_FROM: z.string().email(),

  // App
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),

  // Gemini AI
  GEMINI_API_KEY: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  BACKEND_URL: z.string().default("http://localhost:5000"),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional().or(z.literal("")),
  AWS_SECRET_ACCESS_KEY: z.string().optional().or(z.literal("")),
  AWS_REGION: z.string().default("ap-south-1"),
  AWS_S3_BUCKET_NAME: z.string().default("citysalon"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
