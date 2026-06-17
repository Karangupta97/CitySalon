import { getSupabaseAdmin } from "@config/db";

export type CustomerTag = "vip" | "regular" | "at-risk";

export interface CustomerRow {
  id?: string;
  salon_id: string;
  user_id?: string | null;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  tag?: CustomerTag;
  total_spent?: number;
  visit_count?: number;
  last_visit_at?: string;
  created_at?: string;
  updated_at?: string;
}

export class CustomerRepository {
  private static get table() {
    return getSupabaseAdmin().from("customers");
  }

  static async findBySalonId(
    salonId: string,
    limit = 100,
    offset = 0,
    search?: string,
    tag?: CustomerTag,
  ): Promise<CustomerRow[]> {
    let query = this.table
      .select("*")
      .eq("salon_id", salonId)
      .order("last_visit_at", { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (tag) query = query.eq("tag", tag);
    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data ?? [];
  }

  static async findById(id: string): Promise<CustomerRow | null> {
    const { data, error } = await this.table.select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async findByPhone(salonId: string, phone: string): Promise<CustomerRow | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("salon_id", salonId)
      .eq("phone", phone)
      .maybeSingle();
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return data;
  }

  static async create(customer: CustomerRow): Promise<CustomerRow> {
    const { data, error } = await this.table.insert(customer).select().single();
    if (error) throw new Error(`Database insert failed: ${error.message}`);
    return data;
  }

  static async update(id: string, updates: Partial<CustomerRow>): Promise<CustomerRow> {
    const { data, error } = await this.table
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Database update failed: ${error.message}`);
    return data;
  }

  static async countBySalonId(salonId: string): Promise<number> {
    const { count, error } = await this.table
      .select("*", { count: "exact", head: true })
      .eq("salon_id", salonId);
    if (error) throw new Error(`Database query failed: ${error.message}`);
    return count ?? 0;
  }
}
