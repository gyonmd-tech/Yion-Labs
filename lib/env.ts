import { z } from "zod";

/**
 * Satu-satunya tempat membaca env. Variabel NEXT_PUBLIC_* ditulis eksplisit
 * agar Next.js bisa menyisipkannya ke bundle browser.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

let cached: PublicEnv | undefined;

export function getPublicEnv(): PublicEnv {
  if (cached) return cached;
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  });
  if (!parsed.success) {
    const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Env tidak valid atau belum diisi: ${keys}. Lihat .env.example dan README.`);
  }
  cached = parsed.data;
  return cached;
}

/**
 * Env khusus server (service role, kunci AI). Jangan dipanggil dari komponen client;
 * nilainya tidak pernah ikut ke bundle browser.
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServer: ServerEnv | undefined;

function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error("Env server tidak boleh dibaca di browser.");
  }
}

function formatIssues(error: z.ZodError) {
  return error.issues.map((i) => i.path.join(".") || i.message).join(", ");
}

export function getServerEnv(): ServerEnv {
  assertServer();
  if (cachedServer) return cachedServer;
  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (!parsed.success) {
    throw new Error(`Env server tidak valid atau belum diisi: ${formatIssues(parsed.error)}.`);
  }
  cachedServer = parsed.data;
  return cachedServer;
}

/** Konfigurasi lapisan AI. Provider dipilih di sini, bukan di kode modul. */
const aiEnvSchema = z
  .object({
    AI_TEXT_PROVIDER: z.enum(["anthropic", "mock"]),
    AI_TEXT_MODEL: z.string().min(1).default("claude-opus-5-5"),
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
  })
  .refine((env) => env.AI_TEXT_PROVIDER !== "anthropic" || Boolean(env.ANTHROPIC_API_KEY), {
    path: ["ANTHROPIC_API_KEY"],
    message: "wajib diisi bila AI_TEXT_PROVIDER=anthropic",
  });

export type AiEnv = z.infer<typeof aiEnvSchema>;

let cachedAi: AiEnv | undefined;

export function getAiEnv(): AiEnv {
  assertServer();
  if (cachedAi) return cachedAi;
  const parsed = aiEnvSchema.safeParse({
    AI_TEXT_PROVIDER: process.env.AI_TEXT_PROVIDER,
    AI_TEXT_MODEL: process.env.AI_TEXT_MODEL || undefined,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || undefined,
  });
  if (!parsed.success) {
    throw new Error(`Env AI tidak valid atau belum diisi: ${formatIssues(parsed.error)}.`);
  }
  cachedAi = parsed.data;
  return cachedAi;
}
