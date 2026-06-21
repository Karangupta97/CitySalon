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
  DEMO_ACCOUNTS: {
    "owner@citysalon.demo": {
      id: "demo-owner-00000000-0000-0000-0000-000000000001",
      full_name: "Demo Salon Owner",
      email: "owner@citysalon.demo",
      password: "DemoOwner@123",
      role: "owner" as const,
      phone_number: "+911234567890",
      is_verified: true,
      salon: {
        id: "demo-salon-00000000-0000-0000-0000-000000000001",
        name: "CitySalon Demo",
        city: "Mumbai",
        location: "Andheri West",
        rating: 4.8,
        review_count: 127,
      },
    },
    "admin@citysalon.demo": {
      id: "demo-admin-00000000-0000-0000-0000-000000000002",
      full_name: "Demo Admin",
      email: "admin@citysalon.demo",
      password: "DemoAdmin@123",
      role: "admin" as const,
      phone_number: "+919876543210",
      is_verified: true,
      salon: null,
    },
    "judge@citysalon.com": {
      id: "demo-judge-00000000-0000-0000-0000-000000000003",
      full_name: "Hackathon Judge",
      email: "judge@citysalon.com",
      password: "Password123!",
      role: "owner" as const,
      phone_number: "+910000000000",
      is_verified: true,
      salon: {
        id: "demo-salon-00000000-0000-0000-0000-000000000002",
        name: "Judge's Premium Salon",
        city: "Delhi",
        location: "Connaught Place",
        rating: 4.9,
        review_count: 256,
      },
    },
  },

  // Mock data for demo sessions
  MOCK_SALON_DATA: {
    services: [
      { id: "mock-svc-001", name: "Haircut (Men)", category: "Hair", price: 300, duration: 30 },
      { id: "mock-svc-002", name: "Hair Coloring", category: "Hair", price: 1500, duration: 90 },
      { id: "mock-svc-003", name: "Beard Trim", category: "Grooming", price: 150, duration: 15 },
      { id: "mock-svc-004", name: "Facial (Gold)", category: "Skin", price: 800, duration: 45 },
      { id: "mock-svc-005", name: "Head Massage", category: "Wellness", price: 400, duration: 30 },
    ],
    staff: [
      { id: "mock-staff-001", name: "Rajesh Kumar", role: "Senior Stylist", availability: "available" },
      { id: "mock-staff-002", name: "Priya Sharma", role: "Colorist", availability: "available" },
      { id: "mock-staff-003", name: "Amit Patel", role: "Barber", availability: "busy" },
    ],
    todayAppointments: [
      { id: "mock-apt-001", customer_name: "Arjun Mehta", service_names: ["Haircut (Men)"], start_time: "10:00", status: "confirmed" },
      { id: "mock-apt-002", customer_name: "Sneha Gupta", service_names: ["Hair Coloring", "Head Massage"], start_time: "11:30", status: "pending" },
      { id: "mock-apt-003", customer_name: "Vikram Singh", service_names: ["Beard Trim"], start_time: "14:00", status: "completed" },
    ],
  },
} as const;

/**
 * Check if an email belongs to a demo/mock account.
 */
export function isDemoAccount(email: string): boolean {
  return email.toLowerCase().trim() in AUTH_CONFIG.DEMO_ACCOUNTS;
}

/**
 * Get demo account data by email.
 */
export function getDemoAccount(email: string) {
  const key = email.toLowerCase().trim() as keyof typeof AUTH_CONFIG.DEMO_ACCOUNTS;
  return AUTH_CONFIG.DEMO_ACCOUNTS[key] || null;
}
