import bcrypt from "bcrypt";
import crypto from "crypto";
import { PartnerRepository, PartnerRow } from "@repositories/partner.repository";
import { PartnerRefreshTokenRepository } from "@repositories/refresh-token.repository";
import { PartnerLoginAttemptRepository } from "@repositories/login-attempt.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateFamilyId,
  TokenPayload,
} from "@utils/token";
import { sendVerificationEmail, sendPasswordResetEmail } from "@utils/email";
import { BadRequestError, UnauthorizedError, ForbiddenError } from "@errors/HttpError";
import { AUTH_CONFIG, isDemoAccount, getDemoAccount } from "@config/auth.config";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  partner: SanitizedPartner;
  salon?: DemoSalonData | null;
  isDemo: boolean;
}

export interface SanitizedPartner {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: string;
  is_verified: boolean;
  business_name?: string | null;
  avatar_url?: string | null;
  last_login_at?: string | null;
}

interface DemoSalonData {
  id: string;
  name: string;
  city: string;
  location: string;
  rating: number;
  review_count: number;
}

interface LoginContext {
  ip?: string;
  userAgent?: string;
  deviceInfo?: string;
}

// ─────────────────────────────────────────────────────────────
// Service: Industrial-Level Salon Partner Authentication
// Completely separate from client/user auth.
// ─────────────────────────────────────────────────────────────

export class SalonAuthService {
  // ═══════════════════════════════════════════════════════════
  // PARTNER REGISTRATION
  // ═══════════════════════════════════════════════════════════

  /**
   * Register a new salon partner (owner) account.
   * Uses the `partners` table — fully independent from clients (users table).
   */
  static async registerPartner(data: {
    full_name: string;
    email: string;
    phone_number?: string;
    password: string;
    business_name?: string;
  }): Promise<{ partner: SanitizedPartner; message: string }> {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Block registration with demo account emails
    if (isDemoAccount(normalizedEmail)) {
      throw new BadRequestError("This email is reserved for demo purposes.");
    }

    // Check for existing partner account (only in partners table, NOT users)
    const existingPartner = await PartnerRepository.findByEmail(normalizedEmail);
    if (existingPartner) {
      throw new BadRequestError("A partner account with this email address already exists.");
    }

    // Hash password with high cost factor
    const password_hash = await bcrypt.hash(data.password, AUTH_CONFIG.BCRYPT_ROUNDS);

    // Generate 6-digit verification code
    const verification_token = Math.floor(100000 + Math.random() * 900000).toString();
    const verification_token_expires_at = new Date(
      Date.now() + AUTH_CONFIG.VERIFICATION_CODE_EXPIRY_HOURS * 60 * 60 * 1000
    ).toISOString();

    // Create partner record
    const newPartner = await PartnerRepository.create({
      full_name: data.full_name,
      email: normalizedEmail,
      phone_number: data.phone_number,
      password_hash,
      role: "owner",
      business_name: data.business_name || null,
      verification_token,
      verification_token_expires_at,
      is_verified: false,
      is_active: true,
    });

    // Send verification email (non-blocking)
    try {
      await sendVerificationEmail(newPartner.email, newPartner.full_name, verification_token);
    } catch (err) {
      console.error("Failed to send partner verification email:", err);
    }

    return {
      partner: this.sanitizePartner(newPartner),
      message: "Partner registration successful. Please verify your email to activate your account.",
    };
  }

  // ═══════════════════════════════════════════════════════════
  // PARTNER LOGIN (with account lockout + demo bypass)
  // ═══════════════════════════════════════════════════════════

  /**
   * Authenticate salon partner with industrial-level security:
   * - Demo account instant bypass (no DB)
   * - Account lockout after N failed attempts
   * - Login attempt auditing
   * - Refresh token rotation with family tracking
   * - Session limiting
   */
  static async loginPartner(
    email: string,
    password: string,
    context: LoginContext = {}
  ): Promise<AuthResult> {
    const normalizedEmail = email.toLowerCase().trim();

    // ── Demo Account Fast Path ──────────────────────────────
    if (isDemoAccount(normalizedEmail)) {
      return this.handleDemoLogin(normalizedEmail, password);
    }

    // ── Check Account Lockout ───────────────────────────────
    await this.checkAccountLockout(normalizedEmail, context);

    // ── Find Partner (NOT user) ─────────────────────────────
    const partner = await PartnerRepository.findByEmail(normalizedEmail);
    if (!partner) {
      await this.recordFailedAttempt(normalizedEmail, context, "partner_not_found");
      throw new UnauthorizedError("Invalid email or password.");
    }

    // ── Check Account Active ────────────────────────────────
    if (!partner.is_active) {
      throw new ForbiddenError("This partner account has been deactivated. Contact support.");
    }

    // ── Check Lockout Timer ─────────────────────────────────
    if (partner.locked_until) {
      const lockedUntil = new Date(partner.locked_until).getTime();
      if (lockedUntil > Date.now()) {
        const minutesLeft = Math.ceil((lockedUntil - Date.now()) / 60000);
        throw new ForbiddenError(
          `Account temporarily locked due to multiple failed attempts. Try again in ${minutesLeft} minutes.`
        );
      }
      // Lock expired — reset
      await PartnerRepository.update(partner.id!, {
        failed_login_attempts: 0,
        locked_until: null,
      });
    }

    // ── Verify Password ─────────────────────────────────────
    const isPasswordValid = await bcrypt.compare(password, partner.password_hash);
    if (!isPasswordValid) {
      await this.handleFailedLogin(partner, normalizedEmail, context);
      throw new UnauthorizedError("Invalid email or password.");
    }

    // ── Email Verification Check ────────────────────────────
    if (!partner.is_verified) {
      throw new UnauthorizedError(
        "Please verify your email address before logging in. Check your inbox for the verification code."
      );
    }

    // ── Successful Login ────────────────────────────────────
    return this.createAuthenticatedSession(partner, context);
  }

  // ═══════════════════════════════════════════════════════════
  // TOKEN REFRESH (with rotation theft detection)
  // ═══════════════════════════════════════════════════════════

  /**
   * Rotate refresh token with theft detection:
   * - If a revoked token is reused, the ENTIRE family gets revoked
   * - Issues new access + refresh token pair
   * - Old refresh token is invalidated
   */
  static async refreshTokens(
    rawRefreshToken: string,
    context: LoginContext = {}
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify the token signature
    const decoded = verifyRefreshToken(rawRefreshToken);
    if (!decoded) {
      throw new UnauthorizedError("Invalid or expired refresh token.");
    }

    // Look up in partner_refresh_tokens
    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await PartnerRefreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError("Refresh token not recognized.");
    }

    // ── Rotation Theft Detection ────────────────────────────
    if (storedToken.is_revoked) {
      // Token already used — likely theft! Kill the entire family.
      console.warn(
        `⚠️ SECURITY: Reuse of revoked partner refresh token! Family: ${storedToken.family_id}, Partner: ${storedToken.partner_id}`
      );
      await PartnerRefreshTokenRepository.revokeFamily(storedToken.family_id);
      throw new UnauthorizedError(
        "Security violation detected. All sessions have been terminated. Please log in again."
      );
    }

    // ── Revoke Current Token (single-use) ───────────────────
    await PartnerRefreshTokenRepository.revoke(storedToken.id!);

    // ── Issue New Token Pair ─────────────────────────────────
    const payload: TokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload, storedToken.family_id);
    const newTokenHash = hashToken(newRefreshToken);

    // Store the new token in the same family
    await PartnerRefreshTokenRepository.create({
      partner_id: decoded.userId,
      token_hash: newTokenHash,
      family_id: storedToken.family_id,
      device_info: context.deviceInfo || storedToken.device_info,
      ip_address: context.ip,
      expires_at: new Date(Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS).toISOString(),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ═══════════════════════════════════════════════════════════
  // LOGOUT
  // ═══════════════════════════════════════════════════════════

  /**
   * Revoke the current refresh token.
   */
  static async logout(rawRefreshToken: string): Promise<void> {
    if (!rawRefreshToken) return;

    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await PartnerRefreshTokenRepository.findByTokenHash(tokenHash);

    if (storedToken) {
      await PartnerRefreshTokenRepository.revoke(storedToken.id!);
    }
  }

  /**
   * Force logout from all sessions (panic button).
   */
  static async logoutAllSessions(partnerId: string): Promise<void> {
    await PartnerRefreshTokenRepository.revokeAllForPartner(partnerId);
  }

  // ═══════════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════════

  /**
   * Get partner profile (for /me endpoint).
   */
  static async getPartnerProfile(partnerId: string): Promise<SanitizedPartner | null> {
    // Check demo accounts first
    const demoAccounts = Object.values(AUTH_CONFIG.DEMO_ACCOUNTS);
    const demoAccount = demoAccounts.find((a) => a.id === partnerId);
    if (demoAccount) {
      return {
        id: demoAccount.id,
        full_name: demoAccount.full_name,
        email: demoAccount.email,
        phone_number: demoAccount.phone_number,
        role: demoAccount.role,
        is_verified: true,
        business_name: demoAccount.salon?.name || null,
        avatar_url: null,
        last_login_at: new Date().toISOString(),
      };
    }

    const partner = await PartnerRepository.findById(partnerId);
    if (!partner) return null;
    return this.sanitizePartner(partner);
  }

  // ═══════════════════════════════════════════════════════════
  // CHANGE PASSWORD
  // ═══════════════════════════════════════════════════════════

  /**
   * Change password (requires current password verification).
   * Revokes all sessions after change.
   */
  static async changePassword(
    partnerId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const partner = await PartnerRepository.findById(partnerId);
    if (!partner) {
      throw new BadRequestError("Partner not found.");
    }

    const isValid = await bcrypt.compare(currentPassword, partner.password_hash);
    if (!isValid) {
      throw new UnauthorizedError("Current password is incorrect.");
    }

    const isSame = await bcrypt.compare(newPassword, partner.password_hash);
    if (isSame) {
      throw new BadRequestError("New password must be different from your current password.");
    }

    const password_hash = await bcrypt.hash(newPassword, AUTH_CONFIG.BCRYPT_ROUNDS);
    await PartnerRepository.update(partnerId, {
      password_hash,
      password_changed_at: new Date().toISOString(),
    });

    // Force re-login on all devices
    await PartnerRefreshTokenRepository.revokeAllForPartner(partnerId);
  }

  // ═══════════════════════════════════════════════════════════
  // EMAIL VERIFICATION
  // ═══════════════════════════════════════════════════════════

  /**
   * Verify partner email with 6-digit code.
   * Returns auth tokens on success for auto-login.
   */
  static async verifyPartnerEmail(token: string): Promise<{ accessToken: string; refreshToken: string; partner: SanitizedPartner } | null> {
    const partner = await PartnerRepository.findByVerificationToken(token);
    if (!partner) {
      throw new BadRequestError("Invalid verification code.");
    }

    if (partner.is_verified) {
      // Already verified — still return tokens for auto-login
      return this.generateTokensForPartner(partner);
    }

    const expiresAt = partner.verification_token_expires_at
      ? new Date(partner.verification_token_expires_at).getTime()
      : 0;

    if (expiresAt < Date.now()) {
      // Regenerate and resend
      const newToken = Math.floor(100000 + Math.random() * 900000).toString();
      const newExpiry = new Date(
        Date.now() + AUTH_CONFIG.VERIFICATION_CODE_EXPIRY_HOURS * 60 * 60 * 1000
      ).toISOString();

      await PartnerRepository.update(partner.id!, {
        verification_token: newToken,
        verification_token_expires_at: newExpiry,
      });

      try {
        await sendVerificationEmail(partner.email, partner.full_name, newToken);
      } catch (err) {
        console.error("Failed to resend partner verification:", err);
      }

      throw new BadRequestError("Verification code expired. A new code has been sent to your email.");
    }

    await PartnerRepository.update(partner.id!, {
      is_verified: true,
      verification_token: null,
      verification_token_expires_at: null,
    });

    // Return tokens for auto-login
    const updatedPartner = await PartnerRepository.findById(partner.id!);
    return this.generateTokensForPartner(updatedPartner || partner);
  }

  /**
   * Generate token pair for a partner (used after verification for auto-login).
   */
  private static generateTokensForPartner(partner: PartnerRow): { accessToken: string; refreshToken: string; partner: SanitizedPartner } {
    const payload: TokenPayload = {
      userId: partner.id!,
      email: partner.email,
      role: partner.role || "owner",
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      partner: this.sanitizePartner(partner),
    };
  }

  /**
   * Resend verification code.
   */
  static async resendVerification(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    const partner = await PartnerRepository.findByEmail(normalizedEmail);

    // Silent failure — anti-enumeration
    if (!partner || partner.is_verified) return;

    const newToken = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiry = new Date(
      Date.now() + AUTH_CONFIG.VERIFICATION_CODE_EXPIRY_HOURS * 60 * 60 * 1000
    ).toISOString();

    await PartnerRepository.update(partner.id!, {
      verification_token: newToken,
      verification_token_expires_at: newExpiry,
    });

    try {
      await sendVerificationEmail(partner.email, partner.full_name, newToken);
    } catch (err) {
      console.error("Failed to resend partner verification:", err);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // FORGOT / RESET PASSWORD
  // ═══════════════════════════════════════════════════════════

  /**
   * Initiate password reset (anti-enumeration).
   */
  static async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    if (isDemoAccount(normalizedEmail)) return;

    const partner = await PartnerRepository.findByEmail(normalizedEmail);
    if (!partner) return; // Silent

    const reset_token = crypto.randomBytes(32).toString("hex");
    const reset_token_expires_at = new Date(
      Date.now() + AUTH_CONFIG.RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    ).toISOString();

    await PartnerRepository.update(partner.id!, {
      reset_token,
      reset_token_expires_at,
    });

    try {
      await sendPasswordResetEmail(partner.email, partner.full_name, reset_token);
    } catch (err) {
      console.error("Failed to send partner reset email:", err);
    }
  }

  /**
   * Reset password using verified token.
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const partner = await PartnerRepository.findByResetToken(token);
    if (!partner) {
      throw new BadRequestError("Invalid or expired password reset token.");
    }

    const expiresAt = partner.reset_token_expires_at
      ? new Date(partner.reset_token_expires_at).getTime()
      : 0;
    if (expiresAt < Date.now()) {
      throw new BadRequestError("Password reset token has expired. Please request a new one.");
    }

    const password_hash = await bcrypt.hash(newPassword, AUTH_CONFIG.BCRYPT_ROUNDS);

    await PartnerRepository.update(partner.id!, {
      password_hash,
      reset_token: null,
      reset_token_expires_at: null,
      failed_login_attempts: 0,
      locked_until: null,
      password_changed_at: new Date().toISOString(),
    });

    // Invalidate all sessions
    await PartnerRefreshTokenRepository.revokeAllForPartner(partner.id!);
  }

  // ═══════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Handle demo/mock account login — no DB calls needed.
   */
  private static handleDemoLogin(email: string, password: string): AuthResult {
    const demoAccount = getDemoAccount(email);
    if (!demoAccount) {
      throw new UnauthorizedError("Invalid demo credentials.");
    }

    if (password !== demoAccount.password) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    // Generate real JWTs so middleware works seamlessly
    const payload: TokenPayload = {
      userId: demoAccount.id,
      email: demoAccount.email,
      role: demoAccount.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      partner: {
        id: demoAccount.id,
        full_name: demoAccount.full_name,
        email: demoAccount.email,
        phone_number: demoAccount.phone_number,
        role: demoAccount.role,
        is_verified: true,
        business_name: demoAccount.salon?.name || null,
        avatar_url: null,
        last_login_at: new Date().toISOString(),
      },
      salon: demoAccount.salon,
      isDemo: true,
    };
  }

  /**
   * Check lockout from brute-force attempts.
   */
  private static async checkAccountLockout(
    email: string,
    context: LoginContext
  ): Promise<void> {
    const recentFailures = await PartnerLoginAttemptRepository.countRecentFailures(
      email,
      AUTH_CONFIG.LOCKOUT_DURATION_MINUTES
    );

    if (recentFailures >= AUTH_CONFIG.MAX_FAILED_ATTEMPTS) {
      throw new ForbiddenError(
        `Account temporarily locked due to ${AUTH_CONFIG.MAX_FAILED_ATTEMPTS} failed login attempts. Please try again in ${AUTH_CONFIG.LOCKOUT_DURATION_MINUTES} minutes or reset your password.`
      );
    }

    // IP-based limiting (more lenient: 20 attempts from same IP)
    if (context.ip) {
      const ipFailures = await PartnerLoginAttemptRepository.countRecentFailuresByIp(
        context.ip,
        AUTH_CONFIG.LOCKOUT_DURATION_MINUTES
      );
      if (ipFailures >= AUTH_CONFIG.MAX_FAILED_ATTEMPTS * 4) {
        throw new ForbiddenError(
          "Too many failed login attempts from this IP address. Please try again later."
        );
      }
    }
  }

  /**
   * Handle failed login: audit + lockout increment.
   */
  private static async handleFailedLogin(
    partner: PartnerRow,
    email: string,
    context: LoginContext
  ): Promise<void> {
    await this.recordFailedAttempt(email, context, "invalid_password");

    const currentAttempts = (partner.failed_login_attempts || 0) + 1;
    const updates: Partial<PartnerRow> = { failed_login_attempts: currentAttempts };

    if (currentAttempts >= AUTH_CONFIG.MAX_FAILED_ATTEMPTS) {
      updates.locked_until = new Date(
        Date.now() + AUTH_CONFIG.LOCKOUT_DURATION_MINUTES * 60 * 1000
      ).toISOString();
    }

    await PartnerRepository.update(partner.id!, updates);
  }

  /**
   * Record a failed attempt for audit trail.
   */
  private static async recordFailedAttempt(
    email: string,
    context: LoginContext,
    reason: string
  ): Promise<void> {
    await PartnerLoginAttemptRepository.create({
      email: email.toLowerCase().trim(),
      ip_address: context.ip,
      user_agent: context.userAgent,
      success: false,
      failure_reason: reason,
    });
  }

  /**
   * Create authenticated session with stored refresh token.
   */
  private static async createAuthenticatedSession(
    partner: PartnerRow,
    context: LoginContext
  ): Promise<AuthResult> {
    // Reset failed attempts
    await PartnerRepository.update(partner.id!, {
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: new Date().toISOString(),
      last_login_ip: context.ip || null,
    });

    // Record successful login
    await PartnerLoginAttemptRepository.create({
      email: partner.email,
      ip_address: context.ip,
      user_agent: context.userAgent,
      success: true,
    });

    // Session limit check
    const activeSessions = await PartnerRefreshTokenRepository.countActiveSessions(partner.id!);
    if (activeSessions >= AUTH_CONFIG.MAX_ACTIVE_SESSIONS_PER_USER) {
      console.warn(`Partner ${partner.id} has ${activeSessions} active sessions (limit: ${AUTH_CONFIG.MAX_ACTIVE_SESSIONS_PER_USER})`);
    }

    // Generate tokens
    const payload: TokenPayload = {
      userId: partner.id!,
      email: partner.email,
      role: partner.role || "owner",
    };

    const familyId = generateFamilyId();
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload, familyId);

    // Store refresh token hash
    const tokenHash = hashToken(refreshToken);
    await PartnerRefreshTokenRepository.create({
      partner_id: partner.id!,
      token_hash: tokenHash,
      family_id: familyId,
      device_info: context.deviceInfo || context.userAgent,
      ip_address: context.ip,
      expires_at: new Date(Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRY_MS).toISOString(),
    });

    return {
      accessToken,
      refreshToken,
      partner: this.sanitizePartner(partner),
      salon: null,
      isDemo: false,
    };
  }

  /**
   * Strip sensitive fields from partner record.
   */
  private static sanitizePartner(partner: PartnerRow): SanitizedPartner {
    return {
      id: partner.id!,
      full_name: partner.full_name,
      email: partner.email,
      phone_number: partner.phone_number,
      role: partner.role || "owner",
      is_verified: partner.is_verified || false,
      business_name: partner.business_name,
      avatar_url: partner.avatar_url,
      last_login_at: partner.last_login_at,
    };
  }
}
