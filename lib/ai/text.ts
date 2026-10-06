import "server-only";
import type { z } from "zod";
import { getAiEnv } from "@/lib/env";
import { anthropicProvider } from "@/lib/ai/providers/anthropic";
import { mockProvider } from "@/lib/ai/providers/mock";
import type { TextProvider } from "@/lib/ai/types";
import {
  generateWithRetry,
  type GenerateObjectOptions,
  type GenerateObjectResult,
} from "@/lib/ai/generate";

const providers: Record<ReturnType<typeof getAiEnv>["AI_TEXT_PROVIDER"], TextProvider> = {
  anthropic: anthropicProvider,
  mock: mockProvider,
};

/**
 * Satu-satunya pintu ke AI teks. Mengembalikan JSON yang lolos skema zod,
 * dengan satu kali retry dan batas waktu per percobaan.
 */
export function generateObject<Schema extends z.ZodType>(
  options: GenerateObjectOptions<Schema>,
): Promise<GenerateObjectResult<z.infer<Schema>>> {
  const provider = providers[getAiEnv().AI_TEXT_PROVIDER];
  return generateWithRetry(provider, options);
}

export type { GenerateObjectOptions, GenerateObjectResult } from "@/lib/ai/generate";
