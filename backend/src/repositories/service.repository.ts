import { getSupabaseAdmin } from "@config/db";

export interface ServiceRow {
  id?: string;
  salon_id: string;
  name: string;
  category: string;
  price: number;       // in rupees
  duration: number;    // in minutes
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class ServiceRepository {
  private static get table() {
    return getSupabaseAdmin().from("services");
  }

  static async findBySalonId(salonId: string, activeOnly = true): Promise<ServiceRow[]> {
    let query = this.table.select("*").eq("salon_id", salonId).order("category").order("name");
    if (activeOnly) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }

  static async findById(id: string): Promise<ServiceRow | null> {
    const { data, error } = await this.table.select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async create(service: ServiceRow): Promise<ServiceRow> {
    const { data, error } = await this.table.insert(service).select().single();
    if (error) throw new Error(`Database insert failed: ${error.message}`);
    return data;
  }

  static async update(id: string, updates: Partial<ServiceRow>): Promise<ServiceRow> {
    const { data, error } = await this.table
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Database update failed: ${error.message}`);
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await this.table.update({ is_active: false, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw new Error(`Database update failed: ${error.message}`);
  }
}
