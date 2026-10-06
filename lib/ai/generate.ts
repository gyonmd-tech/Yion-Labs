import type { z } from "zod";
import {
  AiProviderError,
  type AiEffort,
  type AiFailureCode,
  type TextProvider,
} from "@/lib/ai/types";

export type GenerateObjectOptions<Schema extends z.ZodType> = {
  schema: Schema;
  system: string;
  prompt: string;
  maxTokens?: number;
  effort?: AiEffort;
  /** Batas waktu per percobaan. */
  timeoutMs?: number;
  mock?: () => z.infer<Schema>;
};

export type GenerateObjectResult<T> =
  | {
      ok: true;
      data: T;
      model: string;
      attempts: number;
      inputTokens: number;
      outputTokens: number;
    }
  | { ok: false; code: AiFailureCode; attempts: number };

const MAX_ATTEMPTS = 2;

/**
 * Inti lapisan AI, terpisah dari pemilihan provider agar mudah dites.
 * Percobaan kedua hanya dilakukan untuk galat yang bisa pulih.
 */
export async function generateWithRetry<Schema extends z.ZodType>(
  provider: TextProvider,
  options: GenerateObjectOptions<Schema>,
): Promise<GenerateObjectResult<z.infer<Schema>>> {
  let lastCode: AiFailureCode = "unavailable";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await provider.generate({
        schema: options.schema,
        system: options.system,
        prompt: options.prompt,
        maxTokens: options.maxTokens ?? 4096,
        effort: options.effort ?? "low",
        timeoutMs: options.timeoutMs ?? 25_000,
        mock: options.mock,
      });

      if (result.kind === "refused") return { ok: false, code: "refused", attempts: attempt };

      const parsed = options.schema.safeParse(result.data);
      if (parsed.success) {
        return {
          ok: true,
          data: parsed.data,
          model: result.model,
          attempts: attempt,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
        };
      }
      lastCode = "invalid_output";
    } catch (error) {
      if (!(error instanceof AiProviderError)) throw error;
      console.error(
        `[ai] ${provider.name} gagal (percobaan ${attempt}): ${error.code} - ${error.message}`,
      );
      lastCode = error.code;
      if (!error.retryable) return { ok: false, code: error.code, attempts: attempt };
    }
  }

  return { ok: false, code: lastCode, attempts: MAX_ATTEMPTS };
}
