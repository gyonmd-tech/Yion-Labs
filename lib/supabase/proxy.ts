import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";

const PROTECTED_PREFIXES = ["/app", "/admin", "/atur-password"];
const GUEST_ONLY_PATHS = ["/masuk", "/daftar"];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Menyegarkan sesi Supabase dan melindungi rute yang butuh login. */
export async function updateSession(request: NextRequest) {
  const env = getPublicEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // Harus dipanggil sebelum respons dibuat agar token yang disegarkan ikut tersimpan.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const { pathname, search } = request.nextUrl;

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    if (path === "/masuk") url.searchParams.set("next", `${pathname}${search}`);
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  if (!isLoggedIn && PROTECTED_PREFIXES.some((p) => matchesPrefix(pathname, p))) {
    return redirectTo("/masuk");
  }
  if (isLoggedIn && GUEST_ONLY_PATHS.includes(pathname)) {
    return redirectTo("/app");
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
