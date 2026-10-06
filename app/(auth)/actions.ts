"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { authCopy } from "@/content/auth";
import { getPublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-next-path";

export type AuthFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password", string>>;
  /** Nilai yang dikembalikan ke form setelah galat. Kata sandi tidak pernah dikembalikan. */
  values?: { name?: string; email?: string };
};

const e = authCopy.errors;

const emailField = z
  .string()
  .trim()
  .pipe(z.email({ error: e.invalidEmail }));
const newPasswordField = z.string().min(8, { error: e.passwordTooShort }).max(72);

const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, { error: e.passwordRequired }),
});

const signUpSchema = z.object({
  name: z.string().trim().min(1, { error: e.nameRequired }).max(100),
  email: emailField,
  password: newPasswordField,
});

function keptValues(formData: FormData): AuthFormState["values"] {
  const pick = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v.slice(0, 200) : undefined;
  };
  return { name: pick("name"), email: pick("email") };
}

function fieldErrors(error: z.ZodError, formData: FormData): AuthFormState {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return {
    status: "error",
    fieldErrors: {
      name: flat.name?.[0],
      email: flat.email?.[0],
      password: flat.password?.[0],
    },
    values: keptValues(formData),
  };
}

function authErrorMessage(code: string | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return e.invalidCredentials;
    case "email_not_confirmed":
      return e.emailNotConfirmed;
    case "user_already_exists":
    case "email_exists":
      return e.userExists;
    case "weak_password":
      return e.weakPassword;
    case "same_password":
      return e.samePassword;
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return e.rateLimited;
    default:
      return e.generic;
  }
}

function callbackUrl(next: string) {
  const url = new URL("/auth/callback", getPublicEnv().NEXT_PUBLIC_SITE_URL);
  url.searchParams.set("next", next);
  return url.toString();
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fieldErrors(parsed.error, formData);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { status: "error", message: authErrorMessage(error.code), values: keptValues(formData) };
  }

  redirect(safeNextPath(formData.get("next")));
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return fieldErrors(parsed.error, formData);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: callbackUrl("/app"),
    },
  });
  if (error) {
    return { status: "error", message: authErrorMessage(error.code), values: keptValues(formData) };
  }

  // Tanpa sesi berarti konfirmasi email aktif di proyek Supabase.
  if (!data.session) return { status: "success", message: authCopy.signUp.checkEmail };

  redirect("/app");
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(safeNextPath(formData.get("next"))) },
  });
  if (error || !data.url) redirect("/masuk?error=oauth");
  redirect(data.url);
}

export async function requestPasswordReset(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = z.object({ email: emailField }).safeParse({ email: formData.get("email") });
  if (!parsed.success) return fieldErrors(parsed.error, formData);

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: callbackUrl("/atur-password"),
  });
  if (error?.code === "over_email_send_rate_limit" || error?.code === "over_request_rate_limit") {
    return { status: "error", message: e.rateLimited, values: keptValues(formData) };
  }
  // Pesan sama apa pun hasilnya, agar tidak membocorkan email yang terdaftar.
  return { status: "success", message: authCopy.forgot.sent };
}

export async function updatePassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = z.object({ password: newPasswordField }).safeParse({
    password: formData.get("password"),
  });
  if (!parsed.success) return fieldErrors(parsed.error, formData);

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { status: "error", message: authErrorMessage(error.code), values: keptValues(formData) };
  }

  redirect("/app");
}
