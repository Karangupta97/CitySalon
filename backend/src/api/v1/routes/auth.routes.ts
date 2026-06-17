import { Router } from "express";
import { AuthController } from "@controllers/auth.controller";
import { validate } from "@middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleLoginSchema,
} from "@schemas/auth.schema";

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registers a new user and triggers verification email
 * @access  Public
 */
router.post("/register", validate(registerSchema), AuthController.register);

/**
 * @route   GET /api/v1/auth/verify-email
 * @desc    Verifies email address using the verification query token
 * @access  Public
 */
router.get("/verify-email", AuthController.verifyEmail);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticates credentials and returns session tokens
 * @access  Public
 */
router.post("/login", validate(loginSchema), AuthController.login);

/**
 * @route   POST /api/v1/auth/google
 * @desc    Authenticates Google ID token and returns session tokens
 * @access  Public
 */
router.post("/google", validate(googleLoginSchema), AuthController.googleLogin);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Sends password reset email link using token authentication
 * @access  Public
 */
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Resets password utilizing token verification
 * @access  Public
 */
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);

export default router;
