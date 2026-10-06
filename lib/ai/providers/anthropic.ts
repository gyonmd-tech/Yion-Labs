import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { getAiEnv } from "@/lib/env";
import {
  AiProviderError,
  type TextProvider,
  type TextProviderRequest,
  type TextProviderResult,
} from "@/lib/ai/types";

let client: Anthropic | undefined;

function getClient(apiKey: string) {
  // Retry ditangani lapisan text.ts agar total percobaan tetap dua.
  client ??= new Anthropic({ apiKey, maxRetries: 0 });
  return client;
}

function mapError(error: unknown): AiProviderError {
  if (error instanceof AiProviderError) return error;
  if (error instanceof Anthropic.APIConnectionTimeoutError) {
    return new AiProviderError("timeout", true, "Permintaan AI melewati batas waktu.", {
      cause: error,
    });
  }
  if (error instanceof Anthropic.RateLimitError || error instanceof Anthropic.InternalServerError) {
    return new AiProviderError("unavailable", true, "Layanan AI sedang sibuk.", { cause: error });
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return new AiProviderError("unavailable", true, "Tidak bisa terhubung ke layanan AI.", {
      cause: error,
    });
  }
  if (error instanceof Anthropic.APIError) {
    // 400/401/403/404: konfigurasi atau permintaan salah; retry tidak membantu.
    return new AiProviderError(
      "unavailable",
      false,
      `Layanan AI menolak permintaan (${error.status}).`,
      {
        cause: error,
      },
    );
  }
  if (error instanceof Anthropic.AnthropicError) {
    // Mis. JSON keluaran gagal di-parse oleh helper SDK.
    return new AiProviderError("invalid_output", true, "Keluaran AI tidak bisa dibaca.", {
      cause: error,
    });
  }
  return new AiProviderError("unavailable", false, "Galat tak terduga dari layanan AI.", {
    cause: error,
  });
}

export const anthropicProvider: TextProvider = {
  name: "anthropic",
  async generate(request: TextProviderRequest): Promise<TextProviderResult> {
    const env = getAiEnv();
    if (!env.ANTHROPIC_API_KEY) {
      throw new AiProviderError("unavailable", false, "ANTHROPIC_API_KEY belum diisi.");
    }
    try {
      const response = await getClient(env.ANTHROPIC_API_KEY).beta.messages.parse(
        {
          model: env.AI_TEXT_MODEL,
          max_tokens: request.maxTokens,
          system: request.system,
          messages: [{ role: "user", content: request.prompt }],
          output_config: {
            format: betaZodOutputFormat(request.schema),
            effort: request.effort,
          },
          // Bila model menolak karena kebijakan, API mencoba model cadangan otomatis.
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
        },
        { timeout: request.timeoutMs },
      );

      if (response.stop_reason === "refusal") return { kind: "refused" };
      if (response.stop_reason === "max_tokens" || response.parsed_output == null) {
        throw new AiProviderError("invalid_output", true, "Keluaran AI terpotong atau kosong.");
      }
      return {
        kind: "ok",
        data: response.parsed_output,
        model: response.model,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      };
    } catch (error) {
      throw mapError(error);
    }
  },
};
