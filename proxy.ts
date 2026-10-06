import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Halaman marketing tetap statis; proxy hanya berjalan di rute yang terkait sesi.
  matcher: [
    "/app/:path*",
    "/admin/:path*",
    "/masuk",
    "/daftar",
    "/lupa-password",
    "/atur-password",
  ],
};
