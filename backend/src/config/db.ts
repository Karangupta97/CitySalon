import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "@config/env";
import { logger } from "@utils/logger";

let supabase: SupabaseClient | null = null;
let supabaseAdmin: SupabaseClient | null = null;

/**
 * Returns the public Supabase client using the anon public key.
 * Respects Row Level Security (RLS) constraints.
 */
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }
  return supabase;
}

/**
 * Returns the admin Supabase client using the service_role key.
 * Bypasses Row Level Security (RLS) constraints.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseAdmin;
}

export async function connectDB(): Promise<void> {
  try {
    // Initialize both clients
    getSupabase();
    getSupabaseAdmin();
    logger.info("✅ Supabase public and admin clients initialized successfully");
  } catch (error) {
    logger.error("❌ Supabase client initialization failed:", error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  supabase = null;
  supabaseAdmin = null;
  logger.info("Supabase clients cleared");
}
