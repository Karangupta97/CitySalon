import { getSupabaseAdmin } from "@config/db";

export interface StaffRow {
  id?: string;
  salon_id: string;
  name: string;
  role?: string;
  speciality?: string;
  experience?: string;
  phone?: string;
  email?: string;
  photo?: string;
  rating?: number;
  review_count?: number;
  clients?: string;
  availability?: "available" | "busy" | "off";
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StaffBlockRow {
  id?: string;
  staff_id: string;
  salon_id: string;
  date: string;         // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time: string;     // HH:MM
  reason?: string;
  created_at?: string;
}

export class StaffRepository {
  private static get table() {
    return getSupabaseAdmin().from("staff");
  }

  private static get blocksTable() {
    return getSupabaseAdmin().from("staff_blocks");
  }

  static async findBySalonId(salonId: string, activeOnly = true): Promise<StaffRow[]> {
    let query = this.table.select("*").eq("salon_id", salonId).order("name");
    if (activeOnly) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }

  static async findById(id: string): Promise<StaffRow | null> {
    const { data, error } = await this.table.select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async create(staff: StaffRow): Promise<StaffRow> {
    const { data, error } = await this.table.insert(staff).select().single();
    if (error) throw new Error(`Database insert failed: ${error.message}`);
    return data;
  }

  static async update(id: string, updates: Partial<StaffRow>): Promise<StaffRow> {
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

  // Blocks
  static async findBlocksBySalonAndDate(salonId: string, date: string): Promise<StaffBlockRow[]> {
    const { data, error } = await this.blocksTable
      .select("*")
      .eq("salon_id", salonId)
      .eq("date", date);
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }

  static async createBlock(block: StaffBlockRow): Promise<StaffBlockRow> {
    const { data, error } = await this.blocksTable.insert(block).select().single();
    if (error) throw new Error(`Database insert failed: ${error.message}`);
    return data;
  }

  static async deleteBlock(id: string): Promise<void> {
    const { error } = await this.blocksTable.delete().eq("id", id);
    if (error) throw new Error(`Database delete failed: ${error.message}`);
  }
}
