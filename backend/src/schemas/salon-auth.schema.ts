import { z } from "zod";

/**
 * Strong password policy for salon owners:
 * - Min 8 characters
 * - At least 1 lowercase, 1 uppercase, 1 digit, 1 special char
 */
const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

// ─── Owner Registration ───────────────────────────────────────

export const ownerRegisterSchema = z.object({
  body: z.object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(255, "Email must not exceed 255 characters")
      .trim()
      .toLowerCase(),
    phone_number: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)")
      .optional()
      .or(z.literal("")),
    password: strongPassword,
    confirm_password: z.string().min(1, "Please confirm your password"),
    salon_name: z
      .string()
      .min(2, "Salon name must be at least 2 characters")
      .max(255, "Salon name must not exceed 255 characters")
      .optional()
      .or(z.literal("")),
  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  }),
});

// ─── Owner Login ──────────────────────────────────────────────

export const ownerLoginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

// ─── Verify Email ─────────────────────────────────────────────

export const verifyEmailSchema = z.object({
  body: z.object({
    code: z
      .string()
      .length(6, "Verification code must be exactly 6 digits")
      .regex(/^\d{6}$/, "Verification code must be numeric"),
  }),
});

// ─── Resend Verification ──────────────────────────────────────

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),
  }),
});

// ─── Forgot Password ──────────────────────────────────────────

export const ownerForgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),
  }),
});

// ─── Reset Password ───────────────────────────────────────────

export const ownerResetPasswordSchema = z.object({
  body: z.object({
    token: z
      .string()
      .min(1, "Reset token is required"),
    password: strongPassword,
    confirm_password: z.string().min(1, "Please confirm your password"),
  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  }),
});

// ─── Change Password ──────────────────────────────────────────

export const changePasswordSchema = z.object({
  body: z.object({
    current_password: z
      .string()
      .min(1, "Current password is required"),
    new_password: strongPassword,
    confirm_new_password: z.string().min(1, "Please confirm your new password"),
  }).refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  }).refine((data) => data.current_password !== data.new_password, {
    message: "New password must be different from current password",
    path: ["new_password"],
  }),
});

// ─── Refresh Token (body fallback) ────────────────────────────

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
});
