import "server-only";
import { cache } from "react";
import { z } from "zod";
import { brand } from "@/config/brand";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Satu-satunya pintu untuk mengubah saldo kredit. Semua penulisan memanggil
 * fungsi SQL (service role) yang berjalan dalam satu transaksi.
 */

export const LEDGER_REASONS = ["signup_bonus", "topup", "spend", "refund", "admin"] as const;
export type LedgerReason = (typeof LEDGER_REASONS)[number];

const spendRowSchema = z.object({
  status: z.enum(["spent", "already_spent", "insufficient"]),
  balance: z.number().int(),
});
const refundRowSchema = z.object({
  status: z.enum(["refunded", "already_refunded", "not_found"]),
  balance: z.number().int(),
});

export type SpendResult = z.infer<typeof spendRowSchema>;
export type RefundResult = z.infer<typeof refundRowSchema>;

export class CreditsError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CreditsError";
  }
}

function firstRow<T>(schema: z.ZodType<T>, data: unknown, op: string): T {
  const rows = z.array(z.unknown()).safeParse(data);
  const parsed = schema.safeParse(rows.success ? rows.data[0] : data);
  if (!parsed.success) throw new CreditsError(`Respons ${op} tidak valid.`);
  return parsed.data;
}

export async function getBalance(userId: string): Promise<number> {
  const { data, error } = await createAdminClient().rpc("credits_balance", { p_user: userId });
  if (error) throw new CreditsError("Gagal membaca saldo.", { cause: error });
  return z.number().int().parse(data);
}

/** Saldo pengguna, di-cache per request (topbar dan halaman memakai nilai yang sama). */
export const getBalanceCached = cache(getBalance);

/** Beri bonus daftar sekali per pengguna. Aman dipanggil berulang. */
export async function ensureSignupBonus(userId: string): Promise<boolean> {
  const { data, error } = await createAdminClient().rpc("credits_grant_signup_bonus", {
    p_user: userId,
    p_amount: brand.signupBonusCredits,
  });
  if (error) throw new CreditsError("Gagal memberi bonus daftar.", { cause: error });
  return z.boolean().parse(data);
}

/** Bonus daftar lalu saldo, di-cache per request untuk layout aplikasi. */
export const ensureBonusAndGetBalance = cache(async (userId: string) => {
  await ensureSignupBonus(userId);
  return getBalance(userId);
});

/**
 * Potong kredit. Idempoten per `ref` (biasanya generation_id): panggilan ulang
 * mengembalikan "already_spent" tanpa memotong lagi. Saldo tidak bisa negatif.
 */
export async function spendCredits(input: {
  userId: string;
  amount: number;
  ref: string;
}): Promise<SpendResult> {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new CreditsError("Jumlah kredit harus bilangan bulat positif.");
  }
  const { data, error } = await createAdminClient().rpc("credits_spend", {
    p_user: input.userId,
    p_amount: input.amount,
    p_ref: input.ref,
  });
  if (error) throw new CreditsError("Gagal memotong kredit.", { cause: error });
  return firstRow(spendRowSchema, data, "spend");
}

/** Kembalikan kredit dari spend dengan `ref` yang sama. Idempoten. */
export async function refundCredits(input: { userId: string; ref: string }): Promise<RefundResult> {
  const { data, error } = await createAdminClient().rpc("credits_refund", {
    p_user: input.userId,
    p_ref: input.ref,
  });
  if (error) throw new CreditsError("Gagal mengembalikan kredit.", { cause: error });
  return firstRow(refundRowSchema, data, "refund");
}

const ledgerEntrySchema = z.object({
  id: z.string(),
  delta: z.number().int(),
  reason: z.enum(LEDGER_REASONS),
  ref_id: z.string().nullable(),
  created_at: z.string(),
});

export type LedgerEntry = z.infer<typeof ledgerEntrySchema>;

/** Riwayat ledger milik pengguna yang login (dibaca lewat RLS). */
export async function listMyLedger(limit = 50): Promise<LedgerEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("credit_ledger")
    .select("id, delta, reason, ref_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new CreditsError("Gagal membaca riwayat kredit.", { cause: error });
  return z.array(ledgerEntrySchema).parse(data);
}
