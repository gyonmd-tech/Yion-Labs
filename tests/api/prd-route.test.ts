import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { anonClient, startTestBackend, userClient } from "../support/app-env";

// Klien sesi diganti: tes tidak punya cookie Next.js.
let currentClient: SupabaseClient | null = null;
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => currentClient,
}));

// Keluaran mock AI bisa diatur per tes.
const mockOutput = vi.hoisted(() => ({ broken: false }));
vi.mock("@/modules/prd/mock", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/modules/prd/mock")>();
  return {
    prdMockOutput: () => (mockOutput.broken ? { productName: "" } : original.prdMockOutput()),
  };
});

let backend: Awaited<ReturnType<typeof startTestBackend>>;
let POST: (request: Request) => Promise<Response>;

const idea =
  "Aplikasi katalog pesanan kue rumahan yang mengirim pesanan langsung ke WhatsApp penjual.";

function call(body: unknown) {
  return POST(
    new Request("http://localhost/api/ai/prd", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

async function signIn(email: string) {
  const user = await backend.createUser({ email, name: "Uji" });
  currentClient = userClient(backend.url, user.accessToken);
  return user;
}

beforeAll(async () => {
  backend = await startTestBackend();
  ({ POST } = await import("@/app/api/ai/prd/route"));
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(async () => {
  await backend.close();
});

beforeEach(() => {
  mockOutput.broken = false;
});

describe("POST /api/ai/prd", () => {
  it("menolak permintaan tanpa sesi", async () => {
    currentClient = anonClient(backend.url);
    const res = await call({ idea });
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ ok: false, code: "unauthorized" });
  });

  it("memvalidasi input", async () => {
    await signIn("validasi@uji.id");
    const res = await call({ idea: "terlalu pendek" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toMatchObject({ ok: false, code: "invalid_input" });
    expect(body.fieldErrors.idea).toBeDefined();
  });

  it("membuat PRD, menyimpannya, dan menegakkan batas 3 per hari", async () => {
    const user = await signIn("kuota@uji.id");

    for (const expectedRemaining of [2, 1, 0]) {
      const res = await call({ idea });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.remainingToday).toBe(expectedRemaining);
      expect(body.generation.output.productName).toContain("TIRUAN");
      expect(body.generation.costCredits).toBe(0);
    }

    const blocked = await call({ idea });
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toMatchObject({ code: "daily_limit", remainingToday: 0 });

    // Tiga hasil tersimpan sebagai done, terbaca lewat RLS oleh pemiliknya.
    const { data } = await userClient(backend.url, user.accessToken)
      .from("generations")
      .select("module, status, title");
    expect(data).toHaveLength(3);
    expect(data?.every((g) => g.module === "prd" && g.status === "done" && g.title)).toBe(true);
  });

  it("gagal dengan ramah bila keluaran AI tidak valid, tanpa memakan kuota", async () => {
    const user = await signIn("gagal@uji.id");
    mockOutput.broken = true;

    const res = await call({ idea });
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, code: "ai_failed", remainingToday: 3 });

    const { data } = await userClient(backend.url, user.accessToken)
      .from("generations")
      .select("status");
    expect(data).toEqual([{ status: "failed" }]);

    const usage = await backend.db.query<{ count: number }>(
      "select count from public.usage_limits where user_id = $1",
      [user.id],
    );
    expect(usage.rows[0]?.count ?? 0).toBe(0);
  });

  it("hasil pengguna lain tidak terlihat", async () => {
    const a = await signIn("a-rls@uji.id");
    await call({ idea });
    const b = await signIn("b-rls@uji.id");
    const { data } = await userClient(backend.url, b.accessToken).from("generations").select("id");
    expect(data).toEqual([]);
    const { data: own } = await userClient(backend.url, a.accessToken)
      .from("generations")
      .select("id");
    expect(own).toHaveLength(1);
  });
});

describe("rate limit /api/ai", () => {
  it("mengizinkan 10 permintaan per menit lalu menolak", async () => {
    const { hitRateLimit } = await import("@/lib/usage");
    const user = await backend.createUser({ email: "rate@uji.id" });
    const results: boolean[] = [];
    for (let i = 0; i < 11; i++) results.push(await hitRateLimit(user.id));
    expect(results.slice(0, 10).every(Boolean)).toBe(true);
    expect(results[10]).toBe(false);
  });

  it("endpoint mengembalikan 429 rate_limited saat batas terlampaui", async () => {
    const { hitRateLimit } = await import("@/lib/usage");
    const user = await signIn("rate-endpoint@uji.id");
    for (let i = 0; i < 10; i++) await hitRateLimit(user.id);
    const res = await call({ idea });
    expect(res.status).toBe(429);
    expect(await res.json()).toMatchObject({ code: "rate_limited" });
  });
});
