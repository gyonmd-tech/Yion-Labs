import "server-only";
import { z } from "zod";
import { limits } from "@/config/limits";
import { createAdminClient } from "@/lib/supabase/admin";

/** Tanggal hari ini (YYYY-MM-DD) di zona waktu aplikasi. */
export function appToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: limits.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Rate limit per pengguna. true bila permintaan boleh lanjut. */
export async function hitRateLimit(userId: string, rule = limits.aiRequests): Promise<boolean> {
  const { data, error } = await createAdminClient().rpc("rate_limit_hit", {
    p_user: userId,
    p_bucket: rule.bucket,
    p_window_seconds: rule.windowSeconds,
    p_max: rule.max,
  });
  if (error) throw new Error("Gagal memeriksa rate limit.", { cause: error });
  return z.boolean().parse(data);
}

/** Ambil satu kuota harian. Mengembalikan sisa kuota, atau null bila sudah habis. */
export async function consumeDailyUsage(
  userId: string,
  module: string,
  dailyLimit: number,
): Promise<number | null> {
  const { data, error } = await createAdminClient().rpc("usage_consume", {
    p_user: userId,
    p_module: module,
    p_limit: dailyLimit,
  });
  if (error) throw new Error("Gagal memeriksa batas harian.", { cause: error });
  const count = z.number().int().nullable().parse(data);
  return count === null ? null : Math.max(dailyLimit - count, 0);
}

/** Kembalikan satu kuota hari ini, mis. saat generate gagal. */
export async function releaseDailyUsage(userId: string, module: string): Promise<void> {
  const { error } = await createAdminClient().rpc("usage_release", {
    p_user: userId,
    p_module: module,
  });
  if (error) console.error("[usage] gagal mengembalikan kuota", error.message);
}

/** Sisa kuota hari ini untuk ditampilkan di UI. */
export async function getDailyRemaining(
  userId: string,
  module: string,
  dailyLimit: number,
): Promise<number> {
  const { data, error } = await createAdminClient()
    .from("usage_limits")
    .select("count")
    .eq("user_id", userId)
    .eq("module", module)
    .eq("day", appToday())
    .maybeSingle();
  if (error) throw new Error("Gagal membaca batas harian.", { cause: error });
  const count = z.object({ count: z.number().int() }).nullable().parse(data)?.count ?? 0;
  return Math.max(dailyLimit - count, 0);
}
