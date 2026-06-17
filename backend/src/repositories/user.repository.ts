import { getSupabaseAdmin } from "@config/db";

export interface UserRow {
  id?: string;
  full_name: string;
  email: string;
  phone_number?: string;
  password_hash: string;
  role?: string;
  is_verified?: boolean;
  verification_token?: string | null;
  verification_token_expires_at?: string | null;
  reset_token?: string | null;
  reset_token_expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class UserRepository {
  private static get table() {
    return getSupabaseAdmin().from("users");
  }

  /**
   * Find user record by email address.
   */
  static async findByEmail(email: string): Promise<UserRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Find user record by UUID id.
   */
  static async findById(id: string): Promise<UserRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Find user record by active verification token.
   */
  static async findByVerificationToken(token: string): Promise<UserRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("verification_token", token)
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Find user record by password reset token.
   */
  static async findByResetToken(token: string): Promise<UserRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("reset_token", token)
      .maybeSingle();

    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  /**
   * Create a new user record in database.
   */
  static async create(user: UserRow): Promise<UserRow> {
    const { data, error } = await this.table
      .insert({
        ...user,
        email: user.email.toLowerCase().trim(),
      })
      .select()
      .single();

    if (error) throw new Error(`Database insert failed: ${error.message}`);
    return data;
  }

  /**
   * Update existing user record fields.
   */
  static async update(id: string, updates: Partial<UserRow>): Promise<UserRow> {
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
}
