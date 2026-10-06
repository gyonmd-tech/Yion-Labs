import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-next-path";

const otpTypeSchema = z.enum([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

/** Tujuan tautan email (konfirmasi, reset kata sandi) dan login Google. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = otpTypeSchema.safeParse(searchParams.get("type"));

  const supabase = await createClient();
  let ok = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type.success) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type.data });
    ok = !error;
  }

  return NextResponse.redirect(new URL(ok ? next : "/masuk?error=callback", origin));
}
