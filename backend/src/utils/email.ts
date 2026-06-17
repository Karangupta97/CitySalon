import nodemailer from "nodemailer";
import { env } from "@config/env";
import { logger } from "@utils/logger";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const isSecure = env.SMTP_PORT === 465;

    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: isSecure,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Dispatches an email verification link and code to a user via SMTP.
 */
export async function sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
  const verificationLink = `${env.ALLOWED_ORIGINS}/auth/verify-email?token=${token}`;

  // Dev fallback log
  if (
    env.SMTP_USER === "your-smtp-username" ||
    env.SMTP_USER.includes("placeholder") ||
    env.NODE_ENV === "development" && !env.SMTP_USER
  ) {
    logger.info("--------------------------------------------------");
    logger.info(`[MOCK EMAIL TO: ${email}]`);
    logger.info(`Subject: Verify Your Email - CitySalon`);
    logger.info(`Hello ${name},`);
    logger.info(`Verification Code: ${token}`);
    logger.info(`Verification Link: ${verificationLink}`);
    logger.info("--------------------------------------------------");
    return;
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'CitySalon'}" <${env.EMAIL_FROM}>`,
    to: email,
    subject: "Verify Your Email - CitySalon",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4F5B3A; font-family: serif; font-size: 24px;">Verify your email address</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering at CitySalon. Your 6-digit verification code is:</p>
        <p style="margin: 30px 0; text-align: center;">
          <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4F5B3A; background-color: #F7F4EF; padding: 12px 24px; border-radius: 6px; border: 1px solid #EDE6DC;">${token}</span>
        </p>
        <p>Or click this link to verify automatically:</p>
        <p style="margin: 20px 0;">
          <a href="${verificationLink}" style="background-color: #4F5B3A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">If you did not create this account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const transport = getTransporter();
    await transport.sendMail(mailOptions);
    logger.info(`Verification email sent successfully to ${email}`);
  } catch (error: any) {
    logger.error(`Failed to send verification email to ${email}:`, error);
    throw new Error(`Email dispatch failed: ${error.message}`);
  }
}

/**
 * Dispatches a password reset link to a user via SMTP.
 */
export async function sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
  const resetLink = `${env.ALLOWED_ORIGINS}/auth/reset-password?token=${token}`;

  // Dev fallback log
  if (
    env.SMTP_USER === "your-smtp-username" ||
    env.SMTP_USER.includes("placeholder") ||
    env.NODE_ENV === "development" && !env.SMTP_USER
  ) {
    logger.info("--------------------------------------------------");
    logger.info(`[MOCK EMAIL TO: ${email}]`);
    logger.info(`Subject: Reset Your Password - CitySalon`);
    logger.info(`Hello ${name},`);
    logger.info(`Reset Link: ${resetLink}`);
    logger.info("--------------------------------------------------");
    return;
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'CitySalon'}" <${env.EMAIL_FROM}>`,
    to: email,
    subject: "Reset Your Password - CitySalon",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4F5B3A; font-family: serif; font-size: 24px;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. You can do so by clicking the button below:</p>
        <p style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4F5B3A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetLink}</p>
        <p style="font-size: 13px; color: #555;">Please note: This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const transport = getTransporter();
    await transport.sendMail(mailOptions);
    logger.info(`Password reset email sent successfully to ${email}`);
  } catch (error: any) {
    logger.error(`Failed to send password reset email to ${email}:`, error);
    throw new Error(`Email dispatch failed: ${error.message}`);
  }
}
