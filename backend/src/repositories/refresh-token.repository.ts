import { getSupabaseAdmin } from "@config/db";

export interface PartnerRefreshTokenRow {
  id?: string;
  partner_id: string;
  token_hash: string;
  family_id: string;
  is_revoked?: boolean;
  device_info?: string;
  ip_address?: string;
  expires_at: string;
  created_at?: string;
}

/**
 * Repository for partner_refresh_tokens table.
 * Handles token rotation, family revocation (theft detection), and session management.
 */
export class PartnerRefreshTokenRepository {
  private static get table() {
    return getSupabaseAdmin().from("partner_refresh_tokens");
  }

  /**
   * Store a new refresh token record.
   */
  static async create(token: PartnerRefreshTokenRow): Promise<PartnerRefreshTokenRow> {
    const { data, error } = await this.table
      .insert(token)
      .select()
      .single();

    if (error) throw new Error(`Failed to store refresh token: ${error.message}`);
    return data;
  }

  /**
   * Find a refresh token by its hash.
   */
  static async findByTokenHash(tokenHash: string): Promise<PartnerRefreshTokenRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Revoke a specific token.
   */
  static async revoke(id: string): Promise<void> {
    const { error } = await this.table
      .update({ is_revoked: true })
      .eq("id", id);

    if (error) throw new Error(`Failed to revoke token: ${error.message}`);
  }

  /**
   * Revoke ALL tokens in a family (rotation theft detection).
   * When a revoked token is reused, kill the entire family.
   */
  static async revokeFamily(familyId: string): Promise<void> {
    const { error } = await this.table
      .update({ is_revoked: true })
      .eq("family_id", familyId);

    if (error) throw new Error(`Failed to revoke token family: ${error.message}`);
  }

  /**
   * Revoke all tokens for a partner (force logout all sessions).
   */
  static async revokeAllForPartner(partnerId: string): Promise<void> {
    const { error } = await this.table
      .update({ is_revoked: true })
      .eq("partner_id", partnerId);

    if (error) throw new Error(`Failed to revoke all tokens: ${error.message}`);
  }

  /**
   * Count active (non-revoked, non-expired) sessions for a partner.
   */
  static async countActiveSessions(partnerId: string): Promise<number> {
    const { count, error } = await this.table
      .select("*", { count: "exact", head: true })
      .eq("partner_id", partnerId)
      .eq("is_revoked", false)
      .gt("expires_at", new Date().toISOString());

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return count || 0;
  }

  /**
   * Delete expired tokens (cleanup job).
   */
  static async deleteExpired(): Promise<number> {
    const { data, error } = await this.table
      .delete()
      .lt("expires_at", new Date().toISOString())
      .select("id");

    if (error) throw new Error(`Cleanup failed: ${error.message}`);
    return data?.length || 0;
  }
}
