import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters"),
    email: z
      .string()
      .email("Please enter a valid email address"),
    phone_number: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password cannot be empty"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please enter a valid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z
      .string()
      .min(1, "Reset token cannot be empty"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirm_password: z
      .string()
      .min(1, "Confirm password is required"),
  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  }),
});
