import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "@config/env";

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
  isDemo?: boolean;  // true for demo, judge, and dev-team accounts
  jti?: string;      // JWT ID for blacklisting
  sessionId?: string; // Session tracking
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

/**
 * Generate a cryptographically secure JWT ID.
 */
export function generateJti(): string {
  return crypto.randomUUID();
}

/**
 * Generate a cryptographically secure token family ID.
 */
export function generateFamilyId(): string {
  return crypto.randomUUID();
}

/**
 * Hash a refresh token for secure storage (never store raw tokens in DB).
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generate a short-lived access JWT token with JTI for blacklisting support.
 */
export function generateAccessToken(payload: TokenPayload): string {
  const jti = generateJti();
  return jwt.sign({ ...payload, jti }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
    issuer: "citysalon-api",
    audience: "citysalon-client",
  });
}

/**
 * Generate a longer-lived refresh JWT token with family tracking.
 */
export function generateRefreshToken(payload: TokenPayload, familyId?: string): string {
  const jti = generateJti();
  return jwt.sign(
    { ...payload, jti, familyId: familyId || generateFamilyId() },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
      issuer: "citysalon-api",
      audience: "citysalon-client",
    }
  );
}

/**
 * Verify access token signatures with issuer/audience validation.
 */
export function verifyAccessToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, env.JWT_SECRET, {
      issuer: "citysalon-api",
      audience: "citysalon-client",
    }) as DecodedToken;
  } catch (error) {
    return null;
  }
}

/** Alias for verifyAccessToken — used by auth middleware. */
export const verifyToken = verifyAccessToken;

/**
 * Verify refresh token signatures with issuer/audience validation.
 */
export function verifyRefreshToken(token: string): (DecodedToken & { familyId?: string }) | null {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: "citysalon-api",
      audience: "citysalon-client",
    }) as DecodedToken & { familyId?: string };
  } catch (error) {
    return null;
  }
}

/**
 * Decode a token WITHOUT verification (for extracting claims from expired tokens).
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken | null;
  } catch {
    return null;
  }
}
