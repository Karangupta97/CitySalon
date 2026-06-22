import { getSupabaseAdmin } from "@config/db";

export interface SalonRow {
  id?: string;
  owner_id: string;
  name: string;
  slug?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  full_address?: string;
  location?: string;
  city?: string;
  hero_image?: string;
  rating?: number;
  review_count?: number;
  hygiene_score?: number;
  price_guarantee?: boolean;
  live_status?: "available" | "short-wait" | "busy" | "fully-booked";
  wait_time?: string;
  is_active?: boolean;
  hc_autoclave?: boolean;
  hc_fresh_towels?: boolean;
  hc_licensed_staff?: boolean;
  hc_disposable_kits?: boolean;
  hc_sanitization?: boolean;
  hc_air_purification?: boolean;
  ai_review_summary?: string;
  highlights?: string[];
  amenities?: string[];
  instagram?: string;
  opening_hours?: Record<string, string>;
  offers?: any[];
  products?: any[];
  faqs?: any[];
  gallery?: any[];
  created_at?: string;
  updated_at?: string;
  username?: string;
  verified?: boolean;
}

export class SalonRepository {
  private static get table() {
    return getSupabaseAdmin().from("salons");
  }

  static async findById(id: string): Promise<SalonRow | null> {
    const { data, error } = await this.table.select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async findByUsername(username: string): Promise<SalonRow | null> {
    const { data, error } = await this.table.select("*").eq("username", username.toLowerCase()).maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async findBySlug(slug: string): Promise<SalonRow | null> {
    const { data, error } = await this.table.select("*").eq("slug", slug).maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async findByOwnerId(ownerId: string): Promise<SalonRow[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("owner_id", ownerId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }

  static async findByOwnerAndId(ownerId: string, salonId: string): Promise<SalonRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("id", salonId)
      .eq("owner_id", ownerId)
      .maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async create(salon: SalonRow): Promise<SalonRow> {
    const { data, error } = await this.table.insert(salon).select().single();
    if (error) throw new Error(`Database insert failed: ${error.message}`);
    return data;
  }

  static async update(id: string, updates: Partial<SalonRow>): Promise<SalonRow> {
    const { data, error } = await this.table
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Database update failed: ${error.message}`);
    return data;
  }
}
