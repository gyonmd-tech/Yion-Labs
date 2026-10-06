import { AiProviderError, type TextProvider, type TextProviderResult } from "@/lib/ai/types";

/**
 * Provider tiruan untuk pengembangan dan tes tanpa kunci API. Mengembalikan
 * data dari `request.mock`; modul wajib menandai data itu sebagai tiruan.
 */
export const mockProvider: TextProvider = {
  name: "mock",
  async generate(request): Promise<TextProviderResult> {
    if (!request.mock) {
      throw new AiProviderError("unavailable", false, "Modul ini belum punya data tiruan.");
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { kind: "ok", data: request.mock(), model: "mock", inputTokens: 0, outputTokens: 0 };
  },
};
