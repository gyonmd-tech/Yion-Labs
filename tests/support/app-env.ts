import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { FAKE_ANON_KEY, FAKE_SERVICE_KEY, startFakeSupabase } from "./fake-supabase";

/** Menyalakan Supabase tiruan dan mengisi env aplikasi agar menunjuk ke sana. */
export async function startTestBackend() {
  const fake = await startFakeSupabase();
  process.env.NEXT_PUBLIC_SUPABASE_URL = fake.url;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = FAKE_ANON_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = FAKE_SERVICE_KEY;
  process.env.AI_TEXT_PROVIDER = "mock";
  return fake;
}

/** Klien Supabase atas nama pengguna (pengganti klien berbasis cookie di tes). */
export function userClient(url: string, accessToken: string) {
  return createSupabaseClient(url, FAKE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export const anonClient = (url: string) =>
  createSupabaseClient(url, FAKE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
