import { Router } from "express";
import rateLimit from "express-rate-limit";
import { SalonAuthController } from "@controllers/salon-auth.controller";
import { authenticate, requireOwner } from "@middlewares/auth.middleware";
import { validate } from "@middlewares/validate.middleware";
import {
  ownerRegisterSchema,
  ownerLoginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  ownerForgotPasswordSchema,
  ownerResetPasswordSchema,
  changePasswordSchema,
} from "@schemas/salon-auth.schema";
import { AUTH_CONFIG } from "@config/auth.config";

const router = Router();

// ─────────────────────────────────────────────────────────────
// Rate Limiters (per endpoint)
// ─────────────────────────────────────────────────────────────

const loginLimiter = rateLimit({
  windowMs: AUTH_CONFIG.LOGIN_RATE_LIMIT.windowMs,
  max: AUTH_CONFIG.LOGIN_RATE_LIMIT.max,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
    data: null,
    errors: null,
    meta: { timestamp: new Date().toISOString(), version: "v1" },
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

const registerLimiter = rateLimit({
  windowMs: AUTH_CONFIG.REGISTER_RATE_LIMIT.windowMs,
  max: AUTH_CONFIG.REGISTER_RATE_LIMIT.max,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
    data: null,
    errors: null,
    meta: { timestamp: new Date().toISOString(), version: "v1" },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshLimiter = rateLimit({
  windowMs: AUTH_CONFIG.REFRESH_RATE_LIMIT.windowMs,
  max: AUTH_CONFIG.REFRESH_RATE_LIMIT.max,
  message: {
    success: false,
    message: "Too many token refresh requests. Please try again shortly.",
    data: null,
    errors: null,
    meta: { timestamp: new Date().toISOString(), version: "v1" },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: AUTH_CONFIG.FORGOT_PASSWORD_RATE_LIMIT.windowMs,
  max: AUTH_CONFIG.FORGOT_PASSWORD_RATE_LIMIT.max,
  message: {
    success: false,
    message: "Too many password reset requests. Please try again later.",
    data: null,
    errors: null,
    meta: { timestamp: new Date().toISOString(), version: "v1" },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────
// PUBLIC ROUTES (no auth required)
// ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/v1/salon-auth/register
 * @desc    Register a new salon partner (owner) — separate from client users
 * @access  Public (rate limited)
 */
router.post(
  "/register",
  registerLimiter,
  validate(ownerRegisterSchema),
  SalonAuthController.registerPartner
);

/**
 * @route   POST /api/v1/salon-auth/login
 * @desc    Authenticate salon partner credentials (from partners table)
 * @access  Public (rate limited + account lockout)
 */
router.post(
  "/login",
  loginLimiter,
  validate(ownerLoginSchema),
  SalonAuthController.loginPartner
);

/**
 * @route   POST /api/v1/salon-auth/verify-email
 * @desc    Verify partner email with 6-digit code
 * @access  Public
 */
router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  SalonAuthController.verifyEmail
);

/**
 * @route   POST /api/v1/salon-auth/resend-verification
 * @desc    Resend email verification code to partner
 * @access  Public (anti-enumeration)
 */
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  SalonAuthController.resendVerification
);

/**
 * @route   POST /api/v1/salon-auth/forgot-password
 * @desc    Initiate partner password reset
 * @access  Public (rate limited, anti-enumeration)
 */
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(ownerForgotPasswordSchema),
  SalonAuthController.forgotPassword
);

/**
 * @route   POST /api/v1/salon-auth/reset-password
 * @desc    Reset partner password using token
 * @access  Public
 */
router.post(
  "/reset-password",
  validate(ownerResetPasswordSchema),
  SalonAuthController.resetPassword
);

/**
 * @route   POST /api/v1/salon-auth/refresh
 * @desc    Rotate refresh token (reads from HttpOnly cookie)
 * @access  Public (cookie required, rate limited)
 */
router.post(
  "/refresh",
  refreshLimiter,
  SalonAuthController.refreshToken
);

/**
 * @route   GET /api/v1/salon-auth/demo-accounts
 * @desc    Get demo credentials (for login page quick-fill)
 * @access  Public
 */
router.get("/demo-accounts", SalonAuthController.getDemoAccounts);

// ─────────────────────────────────────────────────────────────
// AUTHENTICATED ROUTES (require valid access token + owner role)
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/v1/salon-auth/me
 * @desc    Get current partner profile
 * @access  Private (Owner/Admin)
 */
router.get("/me", authenticate, requireOwner, SalonAuthController.getMe);

/**
 * @route   POST /api/v1/salon-auth/logout
 * @desc    Logout and revoke current refresh token
 * @access  Private
 */
router.post("/logout", authenticate, SalonAuthController.logout);

/**
 * @route   POST /api/v1/salon-auth/logout-all
 * @desc    Force logout from all active sessions
 * @access  Private (Owner/Admin)
 */
router.post("/logout-all", authenticate, requireOwner, SalonAuthController.logoutAll);

/**
 * @route   POST /api/v1/salon-auth/change-password
 * @desc    Change password (requires current password)
 * @access  Private (Owner/Admin)
 */
router.post(
  "/change-password",
  authenticate,
  requireOwner,
  validate(changePasswordSchema),
  SalonAuthController.changePassword
);

/**
 * @route   GET /api/v1/salon-auth/mock-dashboard
 * @desc    Get mock dashboard data (demo accounts only)
 * @access  Private (Demo accounts only)
 */
router.get("/mock-dashboard", authenticate, requireOwner, SalonAuthController.getMockDashboard);

export default router;
