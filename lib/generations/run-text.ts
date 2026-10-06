import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorCopy, type ApiErrorCode } from "@/content/api";
import type { GenerateObjectResult } from "@/lib/ai/text";
import { refundCredits, spendCredits } from "@/lib/credits";
import {
  completeGeneration,
  createQueuedGeneration,
  failGeneration,
} from "@/lib/generations/repository";
import type { ModuleManifest } from "@/lib/modules/types";
import { createClient } from "@/lib/supabase/server";
import { consumeDailyUsage, hitRateLimit, releaseDailyUsage } from "@/lib/usage";

export type TextGenerationResponse<Output> =
  | {
      ok: true;
      generation: {
        id: string;
        title: string;
        output: Output;
        createdAt: string;
        costCredits: number;
      };
      remainingToday: number | null;
      balance: number | null;
    }
  | {
      ok: false;
      code: ApiErrorCode;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
      remainingToday?: number;
    };

type ErrorBody = Extract<TextGenerationResponse<never>, { ok: false }>;

function fail(code: ApiErrorCode, status: number, extra?: Partial<ErrorBody>) {
  const body: ErrorBody = { ok: false, code, message: apiErrorCopy[code], ...extra };
  return NextResponse.json(body, { status });
}

/**
 * Alur generate modul teks (docs/architecture.md, "Alur generate dan kredit"):
 * sesi -> validasi -> rate limit -> batas harian -> generations queued ->
 * AI -> simpan done -> potong kredit (bila modul berbayar).
 * Gagal di AI = tidak ada potongan kredit, dan kuota harian dikembalikan.
 */
export async function runTextGeneration<InputSchema extends z.ZodType, Output>(options: {
  request: Request;
  module: ModuleManifest;
  inputSchema: InputSchema;
  /** Kredit yang dipotong setelah hasil tersimpan; 0 untuk modul gratis. */
  costCredits: number;
  generate: (input: z.infer<InputSchema>) => Promise<GenerateObjectResult<Output>>;
  title: (output: Output) => string;
}): Promise<NextResponse> {
  const { module } = options;

  // 1. Sesi
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return fail("unauthorized", 401);

  if (module.status === "soon") return fail("module_unavailable", 403);

  // 2. Validasi input (teks pengguna tetap dianggap tidak tepercaya setelah ini)
  let body: unknown;
  try {
    body = await options.request.json();
  } catch {
    return fail("invalid_input", 400);
  }
  const parsed = options.inputSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error as z.ZodError).fieldErrors as Record<
      string,
      string[] | undefined
    >;
    return fail("invalid_input", 400, { fieldErrors });
  }
  const input = parsed.data;

  // 3. Rate limit
  if (!(await hitRateLimit(user.id))) return fail("rate_limited", 429);

  // 4. Batas harian (modul gratis)
  const dailyLimit = module.cost.kind === "free" ? module.cost.dailyLimit : null;
  let remainingToday: number | null = null;
  if (dailyLimit !== null) {
    remainingToday = await consumeDailyUsage(user.id, module.slug, dailyLimit);
    if (remainingToday === null) return fail("daily_limit", 429, { remainingToday: 0 });
  }

  // 5. Baris queued, lalu panggil AI
  let generationId: string;
  try {
    generationId = await createQueuedGeneration({
      userId: user.id,
      module: module.slug,
      payload: input,
    });
  } catch (error) {
    console.error("[generate] gagal membuat baris", module.slug, error);
    if (dailyLimit !== null) await releaseDailyUsage(user.id, module.slug);
    return fail("server_error", 500);
  }

  const result = await options.generate(input);
  if (!result.ok) {
    console.error(
      `[generate] ${module.slug} ${generationId} gagal: ${result.code} (${result.attempts}x)`,
    );
    await failGeneration({ id: generationId, userId: user.id, code: result.code });
    if (dailyLimit !== null) await releaseDailyUsage(user.id, module.slug);
    return fail(result.code === "refused" ? "ai_refused" : "ai_failed", 502, {
      remainingToday: remainingToday === null ? undefined : remainingToday + 1,
    });
  }

  // 6. Potong kredit (modul teks berbayar), idempoten per generation_id
  let balance: number | null = null;
  if (options.costCredits > 0) {
    const spend = await spendCredits({
      userId: user.id,
      amount: options.costCredits,
      ref: generationId,
    });
    if (spend.status === "insufficient") {
      await failGeneration({ id: generationId, userId: user.id, code: "insufficient_credits" });
      return fail("insufficient_credits", 402);
    }
    balance = spend.balance;
  }

  // 7. Simpan hasil; bila gagal setelah kredit terpotong, kembalikan kreditnya.
  try {
    const row = await completeGeneration({
      id: generationId,
      userId: user.id,
      title: options.title(result.data),
      output: result.data,
      costCredits: options.costCredits,
    });
    return NextResponse.json({
      ok: true,
      generation: {
        id: row.id,
        title: row.title,
        output: result.data,
        createdAt: row.created_at,
        costCredits: row.cost_credits,
      },
      remainingToday,
      balance,
    } satisfies TextGenerationResponse<Output>);
  } catch (error) {
    console.error("[generate] gagal menyimpan hasil", generationId, error);
    if (options.costCredits > 0) await refundCredits({ userId: user.id, ref: generationId });
    await failGeneration({ id: generationId, userId: user.id, code: "save_failed" });
    return fail("server_error", 500);
  }
}
