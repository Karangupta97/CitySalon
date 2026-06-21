import { Request, Response } from "express";
import { SalonAuthService } from "@services/salon-auth.service";
import { sendSuccess } from "@utils/response";
import { asyncHandler } from "@utils/asyncHandler";
import { BadRequestError } from "@errors/HttpError";
import { AUTH_CONFIG } from "@config/auth.config";

/**
 * Controller: Salon Partner (Owner) Authentication
 * Industrial-level auth endpoints with secure cookie handling.
 * Completely separate from client/user auth.
 */
export class SalonAuthController {
  // ─── Register Partner ───────────────────────────────────────
  static registerPartner = asyncHandler(async (req: Request, res: Response) => {
    const { full_name, email, phone_number, password, business_name } = req.body;

    const result = await SalonAuthService.registerPartner({
      full_name,
      email,
      phone_number,
      password,
      business_name,
    });

    return sendSuccess(res, result.partner, result.message, 201);
  });

  // ─── Login Partner ──────────────────────────────────────────
  static loginPartner = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const context = {
      ip: req.ip || req.socket.remoteAddress || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
      deviceInfo: req.headers["x-device-info"] as string | undefined,
    };

    const result = await SalonAuthService.loginPartner(email, password, context);

    // Set secure HttpOnly cookie for refresh token
    res.cookie("partner_refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/salon-auth/refresh",
      maxAge: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS,
    });

    // Refresh token NEVER in response body — only in HttpOnly cookie
    return sendSuccess(
      res,
      {
        accessToken: result.accessToken,
        partner: result.partner,
        salon: result.salon,
        isDemo: result.isDemo,
      },
      "Login successful."
    );
  });

  // ─── Refresh Token ──────────────────────────────────────────
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies?.partner_refresh_token || req.body?.refreshToken;

    if (!refreshToken) {
      throw new BadRequestError("No refresh token provided.");
    }

    const context = {
      ip: req.ip || req.socket.remoteAddress || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
      deviceInfo: req.headers["x-device-info"] as string | undefined,
    };

    const result = await SalonAuthService.refreshTokens(refreshToken, context);

    // Rotate the cookie
    res.cookie("partner_refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/salon-auth/refresh",
      maxAge: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS,
    });

    return sendSuccess(
      res,
      { accessToken: result.accessToken },
      "Token refreshed successfully."
    );
  });

  // ─── Logout ─────────────────────────────────────────────────
  static logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.partner_refresh_token || req.body?.refreshToken;

    if (refreshToken) {
      await SalonAuthService.logout(refreshToken);
    }

    res.clearCookie("partner_refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/salon-auth/refresh",
    });

    return sendSuccess(res, null, "Logged out successfully.");
  });

  // ─── Logout All Sessions ────────────────────────────────────
  static logoutAll = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      throw new BadRequestError("Authentication required.");
    }

    await SalonAuthService.logoutAllSessions(req.user.userId);

    res.clearCookie("partner_refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/salon-auth/refresh",
    });

    return sendSuccess(res, null, "All sessions terminated successfully.");
  });

  // ─── Get Current Partner Profile ────────────────────────────
  static getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      throw new BadRequestError("Authentication required.");
    }

    const profile = await SalonAuthService.getPartnerProfile(req.user.userId);
    if (!profile) {
      throw new BadRequestError("Partner not found.");
    }

    return sendSuccess(res, profile, "Profile retrieved.");
  });

  // ─── Verify Email ───────────────────────────────────────────
  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;
    if (!code || typeof code !== "string") {
      throw new BadRequestError("Verification code is required.");
    }

    const result = await SalonAuthService.verifyPartnerEmail(code);

    if (result) {
      // Set refresh token cookie for auto-login
      res.cookie("partner_refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1/salon-auth/refresh",
        maxAge: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS,
      });

      return sendSuccess(
        res,
        { accessToken: result.accessToken, partner: result.partner },
        "Email verified successfully. You are now signed in."
      );
    }

    return sendSuccess(res, null, "Email verified successfully.");
  });

  // ─── Resend Verification ────────────────────────────────────
  static resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Email is required.");
    }

    await SalonAuthService.resendVerification(email);
    return sendSuccess(
      res,
      null,
      "If the email exists and is not verified, a new code has been sent."
    );
  });

  // ─── Forgot Password ───────────────────────────────────────
  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await SalonAuthService.forgotPassword(email);
    return sendSuccess(
      res,
      null,
      "If the email exists in our records, a password reset link has been sent."
    );
  });

  // ─── Reset Password ────────────────────────────────────────
  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    await SalonAuthService.resetPassword(token, password);
    return sendSuccess(res, null, "Password reset successfully. Please log in with your new password.");
  });

  // ─── Change Password (Authenticated) ───────────────────────
  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      throw new BadRequestError("Authentication required.");
    }

    const { current_password, new_password } = req.body;
    await SalonAuthService.changePassword(req.user.userId, current_password, new_password);

    res.clearCookie("partner_refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/salon-auth/refresh",
    });

    return sendSuccess(res, null, "Password changed. Please log in again with your new password.");
  });

  // ─── Get Demo Accounts (public — for login page) ───────────
  static getDemoAccounts = asyncHandler(async (_req: Request, res: Response) => {
    const demos = Object.values(AUTH_CONFIG.DEMO_ACCOUNTS).map((a) => ({
      email: a.email,
      password: a.password,
      role: a.role,
      name: a.full_name,
    }));

    return sendSuccess(res, demos, "Demo accounts for testing.");
  });

  // ─── Mock Dashboard Data (demo sessions only) ──────────────
  static getMockDashboard = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      throw new BadRequestError("Authentication required.");
    }

    const demoAccounts = Object.values(AUTH_CONFIG.DEMO_ACCOUNTS);
    const isDemoUser = demoAccounts.some((a) => a.id === req.user!.userId);

    if (!isDemoUser) {
      throw new BadRequestError("Mock data is only available for demo accounts.");
    }

    const demoAccount = demoAccounts.find((a) => a.id === req.user!.userId);

    return sendSuccess(
      res,
      {
        salon: demoAccount?.salon || null,
        services: AUTH_CONFIG.MOCK_SALON_DATA.services,
        staff: AUTH_CONFIG.MOCK_SALON_DATA.staff,
        todayAppointments: AUTH_CONFIG.MOCK_SALON_DATA.todayAppointments,
        stats: {
          totalRevenue: 45600,
          totalAppointments: 128,
          totalCustomers: 89,
          averageRating: 4.8,
          monthlyGrowth: 12.5,
        },
      },
      "Mock dashboard data retrieved."
    );
  });
}
