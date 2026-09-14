import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Service-role client. Bypasses RLS entirely — never import this into any
// client component or expose its result to the browser. Used only for:
// 1) accepting public bookings from unauthenticated customers, and
// 2) owner-triggered employee account management (Supabase Admin API).
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
