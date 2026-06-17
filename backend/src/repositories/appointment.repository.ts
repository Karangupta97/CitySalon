import { getSupabaseAdmin } from "@config/db";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show";

export interface AppointmentRow {
  id?: string;
  salon_id: string;
  customer_id?: string | null;
  staff_id?: string | null;
  service_ids: string[];
  service_names: string[];
  date: string;           // YYYY-MM-DD
  start_time: string;     // HH:MM
  end_time: string;       // HH:MM
  total_price: number;    // in rupees
  status?: AppointmentStatus;
  is_walk_in?: boolean;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export class AppointmentRepository {
  private static get table() {
    return getSupabaseAdmin().from("appointments");
  }

  static async findById(id: string): Promise<AppointmentRow | null> {
    const { data, error } = await this.table.select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async findBySalonAndDate(salonId: string, date: string): Promise<AppointmentRow[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("salon_id", salonId)
      .eq("date", date)
      .neq("status", "cancelled")
      .order("start_time");
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }

  static async findBySalonDateRange(
    salonId: string,
    startDate: string,
    endDate: string,
  ): Promise<AppointmentRow[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("salon_id", salonId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date")
      .order("start_time");
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }

  static async findBySalonId(
    salonId: string,
    limit = 50,
    offset = 0,
  ): Promise<AppointmentRow[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("salon_id", salonId)
      .order("date", { ascending: false })
      .order("start_time", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }

  static async create(appointment: AppointmentRow): Promise<AppointmentRow> {
    const { data, error } = await this.table.insert(appointment).select().single();
    if (error) throw new Error(`Database insert failed: ${error.message}`);
    return data;
  }

  static async update(id: string, updates: Partial<AppointmentRow>): Promise<AppointmentRow> {
    const { data, error } = await this.table
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Database update failed: ${error.message}`);
    return data;
  }

  /** Returns aggregate stats for a given date range. */
  static async getStatsForPeriod(
    salonId: string,
    startDate: string,
    endDate: string,
  ): Promise<AppointmentRow[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("salon_id", salonId)
      .gte("date", startDate)
      .lte("date", endDate);
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }
}
