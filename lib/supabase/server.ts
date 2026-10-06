import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";

/** Klien Supabase untuk Server Components, Server Actions, dan Route Handlers. */
export async function createClient() {
  // cookies() dulu: menandai rute sebagai dinamis sebelum env dibaca saat build.
  const cookieStore = await cookies();
  const env = getPublicEnv();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component: cookie tidak bisa ditulis di sini.
          // Penyegaran sesi ditangani proxy.ts.
        }
      },
    },
  });
}

/** Pengguna yang sedang login, diverifikasi ke server Auth; null bila belum login. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
