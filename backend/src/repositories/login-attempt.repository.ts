import { getSupabaseAdmin } from "@config/db";

export interface PartnerLoginAttemptRow {
  id?: string;
  email: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
  attempted_at?: string;
}

/**
 * Repository for partner_login_attempts table.
 * Tracks login attempts for brute-force detection and account lockout.
 */
export class PartnerLoginAttemptRepository {
  private static get table() {
    return getSupabaseAdmin().from("partner_login_attempts");
  }

  /**
   * Record a login attempt (success or failure).
   */
  static async create(attempt: PartnerLoginAttemptRow): Promise<void> {
    const { error } = await this.table.insert(attempt);
    if (error) {
      console.error("Failed to record partner login attempt:", error.message);
      // Non-blocking — don't fail the auth flow for audit logging issues
    }
  }

  /**
   * Count recent failed attempts for an email within a time window.
   */
  static async countRecentFailures(email: string, windowMinutes: number): Promise<number> {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const { count, error } = await this.table
      .select("*", { count: "exact", head: true })
      .eq("email", email.toLowerCase().trim())
      .eq("success", false)
      .gte("attempted_at", since);

    if (error) {
      console.error("Failed to count partner login attempts:", error.message);
      return 0; // Fail open — don't lock out partners due to DB issues
    }
    return count || 0;
  }

  /**
   * Count recent failed attempts from an IP within a time window.
   */
  static async countRecentFailuresByIp(ip: string, windowMinutes: number): Promise<number> {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const { count, error } = await this.table
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("success", false)
      .gte("attempted_at", since);

    if (error) {
      console.error("Failed to count IP attempts:", error.message);
      return 0;
    }
    return count || 0;
  }
}
