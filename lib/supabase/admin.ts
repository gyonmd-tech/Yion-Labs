import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv, getServerEnv } from "@/lib/env";

/**
 * Klien service role: melewati RLS. Hanya untuk lib/credits, lib/generations,
 * dan pembatas pemakaian di server. Jangan pernah dipakai untuk membaca data
 * atas nama pengguna tanpa memfilter user_id.
 */
export function createAdminClient() {
  const { NEXT_PUBLIC_SUPABASE_URL } = getPublicEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();
  return createSupabaseClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
