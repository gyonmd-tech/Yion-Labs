import { generateObject } from "@/lib/ai/text";
import { runTextGeneration } from "@/lib/generations/run-text";
import { manifest } from "@/modules/prd/manifest";
import { prdMockOutput } from "@/modules/prd/mock";
import { buildPrdPrompt, prdSystemPrompt, prdTitle } from "@/modules/prd/prompt";
import { prdInputSchema, prdOutputSchema } from "@/modules/prd/schema";

// Dua percobaan AI masing-masing maksimal 25 detik.
export const maxDuration = 60;

export async function POST(request: Request) {
  return runTextGeneration({
    request,
    module: manifest,
    inputSchema: prdInputSchema,
    costCredits: 0,
    title: prdTitle,
    generate: (input) =>
      generateObject({
        schema: prdOutputSchema,
        system: prdSystemPrompt,
        prompt: buildPrdPrompt(input),
        maxTokens: 4096,
        effort: "low",
        mock: prdMockOutput,
      }),
  });
}
