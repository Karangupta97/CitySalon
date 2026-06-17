import { Request, Response } from "express";
import { AuthService } from "@services/auth.service";
import { sendSuccess } from "@utils/response";
import { asyncHandler } from "@utils/asyncHandler";
import { BadRequestError } from "@errors/HttpError";

export class AuthController {
  /**
   * Registers a new user.
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { full_name, email, phone_number, password } = req.body;
    const user = await AuthService.register({ full_name, email, phone_number, password });
    return sendSuccess(res, user, "Registration successful. A verification link has been sent to your email address.", 201);
  });

  /**
   * Verifies a user's email verification token.
   */
  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      throw new BadRequestError("Verification token is required.");
    }
    await AuthService.verifyEmail(token);
    return sendSuccess(res, null, "Email address has been successfully verified. You can now log in.");
  });

  /**
   * Handles user credentials login, sets HttpOnly cookies, and returns the access JWT.
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthService.login(email, password);

    // Set secure HttpOnly cookie for refresh tokens
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, { accessToken, user }, "Login successful.");
  });

  /**
   * Initiates the password recovery workflow.
   */
  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await AuthService.forgotPassword(email);
    return sendSuccess(res, null, "If the email exists in our records, a password reset link has been dispatched.");
  });

  /**
   * Resets the user's password using the verified reset token.
   */
  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    await AuthService.resetPassword(token, password);
    return sendSuccess(res, null, "Password has been successfully updated. You can now log in with your new credentials.");
  });

  /**
   * Handles Google OAuth token login.
   */
  static googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;
    if (!idToken || typeof idToken !== "string") {
      throw new BadRequestError("Google ID Token is required.");
    }
    const { accessToken, refreshToken, user } = await AuthService.googleLogin(idToken);

    // Set secure HttpOnly cookie for refresh tokens
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, { accessToken, user }, "Google login successful.");
  });
}
