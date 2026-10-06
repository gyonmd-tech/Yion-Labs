import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { generateWithRetry } from "@/lib/ai/generate";
import { AiProviderError, type TextProvider, type TextProviderResult } from "@/lib/ai/types";

const schema = z.object({ title: z.string().min(1) });

function providerFrom(results: Array<TextProviderResult | AiProviderError>): TextProvider & {
  calls: number;
} {
  const provider = {
    name: "fake",
    calls: 0,
    async generate() {
      const next = results[provider.calls++];
      if (next instanceof AiProviderError) throw next;
      return next;
    },
  };
  return provider;
}

const ok = (data: unknown): TextProviderResult => ({
  kind: "ok",
  data,
  model: "fake-model",
  inputTokens: 10,
  outputTokens: 20,
});

const base = { schema, system: "s", prompt: "p" };

describe("generateWithRetry", () => {
  it("mengembalikan data yang lolos skema pada percobaan pertama", async () => {
    const provider = providerFrom([ok({ title: "Halo" })]);
    const result = await generateWithRetry(provider, base);
    expect(result).toMatchObject({ ok: true, data: { title: "Halo" }, attempts: 1 });
    expect(provider.calls).toBe(1);
  });

  it("retry sekali bila keluaran tidak lolos skema", async () => {
    const provider = providerFrom([ok({ title: "" }), ok({ title: "Kedua" })]);
    const result = await generateWithRetry(provider, base);
    expect(result).toMatchObject({ ok: true, data: { title: "Kedua" }, attempts: 2 });
  });

  it("gagal dengan invalid_output setelah dua keluaran tidak valid", async () => {
    const provider = providerFrom([
      ok({ nope: 1 }),
      ok({ nope: 2 }),
      ok({ title: "tidak dipakai" }),
    ]);
    const result = await generateWithRetry(provider, base);
    expect(result).toEqual({ ok: false, code: "invalid_output", attempts: 2 });
    expect(provider.calls).toBe(2);
  });

  it("retry sekali setelah timeout, lalu menyerah", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const timeout = () => new AiProviderError("timeout", true, "timeout");
    const provider = providerFrom([timeout(), timeout()]);
    const result = await generateWithRetry(provider, base);
    expect(result).toEqual({ ok: false, code: "timeout", attempts: 2 });
  });

  it("tidak retry untuk galat yang tidak bisa pulih", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const provider = providerFrom([
      new AiProviderError("unavailable", false, "kunci salah"),
      ok({ title: "tidak dipakai" }),
    ]);
    const result = await generateWithRetry(provider, base);
    expect(result).toEqual({ ok: false, code: "unavailable", attempts: 1 });
    expect(provider.calls).toBe(1);
  });

  it("tidak retry bila model menolak", async () => {
    const provider = providerFrom([{ kind: "refused" }, ok({ title: "x" })]);
    const result = await generateWithRetry(provider, base);
    expect(result).toEqual({ ok: false, code: "refused", attempts: 1 });
  });

  it("meneruskan default batas waktu dan effort ke provider", async () => {
    const generate = vi.fn(async () => ok({ title: "x" }));
    await generateWithRetry({ name: "spy", generate }, base);
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({ timeoutMs: 25_000, effort: "low", maxTokens: 4096 }),
    );
  });
});
