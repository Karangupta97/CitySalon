import { getSupabaseAdmin } from "@config/db";

export interface PartnerRow {
  id?: string;
  full_name: string;
  email: string;
  phone_number?: string;
  password_hash: string;
  role?: string;
  is_verified?: boolean;
  is_active?: boolean;
  verification_token?: string | null;
  verification_token_expires_at?: string | null;
  reset_token?: string | null;
  reset_token_expires_at?: string | null;
  failed_login_attempts?: number;
  locked_until?: string | null;
  last_login_at?: string | null;
  last_login_ip?: string | null;
  password_changed_at?: string | null;
  avatar_url?: string | null;
  business_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class PartnerRepository {
  private static get table() {
    return getSupabaseAdmin().from("partners");
  }

  /**
   * Find partner by email address.
   */
  static async findByEmail(email: string): Promise<PartnerRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Find partner by UUID.
   */
  static async findById(id: string): Promise<PartnerRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Find partner by verification token.
   */
  static async findByVerificationToken(token: string): Promise<PartnerRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("verification_token", token)
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Find partner by reset token.
   */
  static async findByResetToken(token: string): Promise<PartnerRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("reset_token", token)
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Create a new partner record.
   */
  static async create(partner: PartnerRow): Promise<PartnerRow> {
    const { data, error } = await this.table
      .insert({
        ...partner,
        email: partner.email.toLowerCase().trim(),
      })
      .select()
      .single();

    if (error) throw new Error(`Database insert failed: ${error.message}`);
    return data;
  }

  /**
   * Update partner fields.
   */
  static async update(id: string, updates: Partial<PartnerRow>): Promise<PartnerRow> {
    const { data, error } = await this.table
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Database update failed: ${error.message}`);
    return data;
  }

  /**
   * Soft-delete (deactivate) a partner account.
   */
  static async deactivate(id: string): Promise<void> {
    const { error } = await this.table
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(`Database update failed: ${error.message}`);
  }
}
