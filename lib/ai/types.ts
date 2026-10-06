import type { z } from "zod";

export type AiEffort = "low" | "medium" | "high";

/** Permintaan ke provider teks. `schema` menentukan bentuk JSON yang diminta. */
export type TextProviderRequest = {
  schema: z.ZodType;
  system: string;
  prompt: string;
  maxTokens: number;
  effort: AiEffort;
  timeoutMs: number;
  /** Data tiruan untuk provider "mock". Diabaikan provider lain. */
  mock?: () => unknown;
};

export type TextProviderResult =
  | { kind: "ok"; data: unknown; model: string; inputTokens: number; outputTokens: number }
  | { kind: "refused" };

export type TextProvider = {
  name: string;
  generate(request: TextProviderRequest): Promise<TextProviderResult>;
};

export type AiFailureCode = "timeout" | "invalid_output" | "refused" | "unavailable";

/** Galat dari provider. `retryable` menentukan apakah satu retry masuk akal. */
export class AiProviderError extends Error {
  constructor(
    readonly code: AiFailureCode,
    readonly retryable: boolean,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "AiProviderError";
  }
}
