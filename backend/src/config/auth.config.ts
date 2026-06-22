import demoAccounts from "./demo-accounts.json";
import mockSalonData from "./mock-salon-data.json";

/**
 * Industrial-Level Auth Configuration
 * Centralized security constants and thresholds.
 */

export const AUTH_CONFIG = {
  // Password hashing
  BCRYPT_ROUNDS: 12,

  // Account lockout
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,

  // Rate limiting (per IP)
  LOGIN_RATE_LIMIT: { windowMs: 15 * 60 * 1000, max: 10 },       // 10 attempts per 15min
  REGISTER_RATE_LIMIT: { windowMs: 60 * 60 * 1000, max: 5 },     // 5 registrations per hour
  REFRESH_RATE_LIMIT: { windowMs: 60 * 1000, max: 5 },           // 5 refresh per minute
  FORGOT_PASSWORD_RATE_LIMIT: { windowMs: 60 * 60 * 1000, max: 3 }, // 3 per hour

  // Token expiry
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
  REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,

  // Verification
  VERIFICATION_CODE_EXPIRY_HOURS: 24,
  RESET_TOKEN_EXPIRY_HOURS: 1,

  // Session limits
  MAX_ACTIVE_SESSIONS_PER_USER: 5,

  // Demo accounts (bypass real DB for hackathon/demo purposes)
  DEMO_ACCOUNTS: demoAccounts,

  // Mock data for demo sessions
  MOCK_SALON_DATA: mockSalonData,

  /**
   * Dev team emails — these accounts see mock data during development.
   * Add your team member emails here.
   */
  DEV_TEAM_EMAILS: [
    "dev@citysalon.com",
    "karan@citysalon.com",
    "admin@citysalon.com",
  ] as string[],
} as const;

/**
 * Dev team emails — members of the CitySalon dev team who see mock data.
 * Extend this array with real team member emails.
 */
export const DEV_TEAM_EMAILS: string[] = [
  "dev@citysalon.com",
  "karan@citysalon.com",
  "admin@citysalon.com",
];

/**
 * Check if an email belongs to a demo/mock account OR dev team member.
 */
export function isDemoAccount(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  return (
    normalized in AUTH_CONFIG.DEMO_ACCOUNTS ||
    DEV_TEAM_EMAILS.map((e) => e.toLowerCase()).includes(normalized)
  );
}

/**
 * Get demo account data by email.
 */
export function getDemoAccount(email: string) {
  const key = email.toLowerCase().trim() as keyof typeof AUTH_CONFIG.DEMO_ACCOUNTS;
  return AUTH_CONFIG.DEMO_ACCOUNTS[key] || null;
}

/**
 * Check specifically if this is a named demo account (not just dev team).
 */
export function isNamedDemoAccount(email: string): boolean {
  return email.toLowerCase().trim() in AUTH_CONFIG.DEMO_ACCOUNTS;
}

/**
 * Check if email belongs to the dev team.
 */
export function isDevTeamAccount(email: string): boolean {
  return DEV_TEAM_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase().trim());
}
