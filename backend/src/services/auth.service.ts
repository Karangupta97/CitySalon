import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserRepository, UserRow } from "@repositories/user.repository";
import { sendVerificationEmail, sendPasswordResetEmail } from "@utils/email";
import { generateAccessToken, generateRefreshToken } from "@utils/token";
import { BadRequestError, UnauthorizedError } from "@errors/HttpError";

export class AuthService {
  /**
   * Registers a new user, hashes password, generates verification token, and dispatches email.
   */
  static async register(data: { full_name: string; email: string; phone_number?: string; password: string }): Promise<Omit<UserRow, "password_hash">> {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError("A user with this email address already exists.");
    }

    // Strong salted bcrypt hashing
    const password_hash = await bcrypt.hash(data.password, 12);

    // User-friendly 6-digit verification code (expires in 24 hours)
    const verification_token = Math.floor(100000 + Math.random() * 900000).toString();
    const verification_token_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newUser = await UserRepository.create({
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      password_hash,
      verification_token,
      verification_token_expires_at,
      is_verified: false,
    });

    // Send AWS SES verification email
    await sendVerificationEmail(newUser.email, newUser.full_name, verification_token);

    // Strip password and token hashes
    const { password_hash: _, verification_token: __, ...userResponse } = newUser;
    return userResponse;
  }

  /**
   * Verifies the user's email matching verification token.
   */
  static async verifyEmail(token: string): Promise<void> {
    const user = await UserRepository.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestError("Invalid or expired email verification token.");
    }

    if (user.is_verified) {
      return; // Idempotent success
    }

    const expiresAt = user.verification_token_expires_at ? new Date(user.verification_token_expires_at).getTime() : 0;
    if (expiresAt < Date.now()) {
      // Regenerate 6-digit verification code
      const newVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      await UserRepository.update(user.id!, {
        verification_token: newVerificationToken,
        verification_token_expires_at: newExpiresAt,
      });
      
      await sendVerificationEmail(user.email, user.full_name, newVerificationToken);
      throw new BadRequestError("Verification token has expired. A new verification link has been sent to your email.");
    }

    // Verify user and clear tokens
    await UserRepository.update(user.id!, {
      is_verified: true,
      verification_token: null,
      verification_token_expires_at: null,
    });
  }

  /**
   * Authenticates user, checks verification status, and returns signed access & refresh JWT tokens.
   */
  static async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: Omit<UserRow, "password_hash"> }> {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await UserRepository.findByEmail(normalizedEmail);

    // Auto-seed hackathon judge user if logging in with demo credentials and user doesn't exist yet
    if (!user && normalizedEmail === "judge@citysalon.com") {
      try {
        const password_hash = await bcrypt.hash("Password123!", 12);
        user = await UserRepository.create({
          full_name: "Demo Judge",
          email: "judge@citysalon.com",
          password_hash,
          is_verified: true,
          verification_token: null,
          verification_token_expires_at: null,
        });
      } catch (err) {
        console.error("Failed to seed demo judge user:", err);
      }
    }

    if (!user) {
      throw new UnauthorizedError("Invalid email or password credentials.");
    }

    // Cryptographic comparison
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password credentials.");
    }

    // Verification check
    if (!user.is_verified) {
      throw new UnauthorizedError("Please verify your email address before logging in.");
    }

    // Generate session JWT tokens
    const payload = { userId: user.id!, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { password_hash: _, verification_token: __, reset_token: ___, ...userResponse } = user;
    return { accessToken, refreshToken, user: userResponse };
  }

  /**
   * Triggers forgot-password workflow by generating a reset token and dispatching email.
   * Safeguarded against user enumeration attacks.
   */
  static async forgotPassword(email: string): Promise<void> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Avoid enumeration disclosures by returning quietly
      return;
    }

    // Secure random reset token (expires in 1 hour)
    const reset_token = crypto.randomBytes(32).toString("hex");
    const reset_token_expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await UserRepository.update(user.id!, {
      reset_token,
      reset_token_expires_at,
    });

    // Send AWS SES reset email
    await sendPasswordResetEmail(user.email, user.full_name, reset_token);
  }

  /**
   * Resets user password matching valid reset token.
   */
  static async resetPassword(token: string, password: string): Promise<void> {
    const user = await UserRepository.findByResetToken(token);
    if (!user) {
      throw new BadRequestError("Invalid or expired password reset token.");
    }

    const expiresAt = user.reset_token_expires_at ? new Date(user.reset_token_expires_at).getTime() : 0;
    if (expiresAt < Date.now()) {
      throw new BadRequestError("Password reset token has expired.");
    }

    // Salt and hash new password
    const password_hash = await bcrypt.hash(password, 12);

    // Commit new password and clear token
    await UserRepository.update(user.id!, {
      password_hash,
      reset_token: null,
      reset_token_expires_at: null,
    });
  }
}
