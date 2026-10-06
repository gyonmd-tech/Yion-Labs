import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startTestBackend, userClient } from "../support/app-env";
import {
  CreditsError,
  ensureSignupBonus,
  getBalance,
  refundCredits,
  spendCredits,
} from "@/lib/credits/ledger";

let backend: Awaited<ReturnType<typeof startTestBackend>>;
let n = 0;

async function newUserWithBonus() {
  const user = await backend.createUser({ email: `ledger-${++n}@uji.id` });
  await ensureSignupBonus(user.id);
  return user;
}

beforeAll(async () => {
  backend = await startTestBackend();
});

afterAll(async () => {
  await backend.close();
});

describe("bonus daftar", () => {
  it("diberikan tepat sekali sebesar 10 kredit", async () => {
    const user = await backend.createUser({ email: "bonus@uji.id" });
    expect(await getBalance(user.id)).toBe(0);
    expect(await ensureSignupBonus(user.id)).toBe(true);
    expect(await ensureSignupBonus(user.id)).toBe(false);
    expect(await getBalance(user.id)).toBe(10);
  });
});

describe("spendCredits", () => {
  it("memotong saldo dan idempoten per ref", async () => {
    const user = await newUserWithBonus();
    expect(await spendCredits({ userId: user.id, amount: 3, ref: "gen-1" })).toEqual({
      status: "spent",
      balance: 7,
    });
    expect(await spendCredits({ userId: user.id, amount: 3, ref: "gen-1" })).toEqual({
      status: "already_spent",
      balance: 7,
    });
    expect(await getBalance(user.id)).toBe(7);

    const rows = await backend.db.query(
      "select 1 from public.credit_ledger where user_id = $1 and reason = 'spend'",
      [user.id],
    );
    expect(rows.rows).toHaveLength(1);
  });

  it("menolak bila saldo tidak cukup tanpa menulis baris", async () => {
    const user = await newUserWithBonus();
    expect(await spendCredits({ userId: user.id, amount: 11, ref: "mahal" })).toEqual({
      status: "insufficient",
      balance: 10,
    });
    expect(await getBalance(user.id)).toBe(10);
  });

  it("saldo bisa habis tepat nol tapi tidak pernah negatif", async () => {
    const user = await newUserWithBonus();
    expect((await spendCredits({ userId: user.id, amount: 10, ref: "habis" })).balance).toBe(0);
    expect(await spendCredits({ userId: user.id, amount: 1, ref: "lagi" })).toEqual({
      status: "insufficient",
      balance: 0,
    });
    expect(await getBalance(user.id)).toBe(0);
  });

  it("banyak potongan sekaligus tidak membuat saldo negatif", async () => {
    const user = await newUserWithBonus();
    const results = await Promise.all(
      Array.from({ length: 6 }, (_, i) =>
        spendCredits({ userId: user.id, amount: 3, ref: `par-${i}` }),
      ),
    );
    expect(results.filter((r) => r.status === "spent")).toHaveLength(3);
    expect(results.filter((r) => r.status === "insufficient")).toHaveLength(3);
    expect(await getBalance(user.id)).toBe(1);
  });

  it("menolak jumlah yang bukan bilangan bulat positif", async () => {
    const user = await newUserWithBonus();
    for (const amount of [0, -5, 1.5]) {
      await expect(
        spendCredits({ userId: user.id, amount, ref: `x-${amount}` }),
      ).rejects.toBeInstanceOf(CreditsError);
    }
    expect(await getBalance(user.id)).toBe(10);
  });

  it("ref yang sama milik pengguna lain tidak saling mengganggu", async () => {
    const a = await newUserWithBonus();
    const b = await newUserWithBonus();
    expect((await spendCredits({ userId: a.id, amount: 2, ref: "sama" })).status).toBe("spent");
    expect((await spendCredits({ userId: b.id, amount: 2, ref: "sama-b" })).status).toBe("spent");
    expect(await getBalance(a.id)).toBe(8);
    expect(await getBalance(b.id)).toBe(8);
  });
});

describe("refundCredits", () => {
  it("mengembalikan kredit sekali saja", async () => {
    const user = await newUserWithBonus();
    await spendCredits({ userId: user.id, amount: 4, ref: "gagal-simpan" });
    expect(await refundCredits({ userId: user.id, ref: "gagal-simpan" })).toEqual({
      status: "refunded",
      balance: 10,
    });
    expect(await refundCredits({ userId: user.id, ref: "gagal-simpan" })).toEqual({
      status: "already_refunded",
      balance: 10,
    });
  });

  it("tidak melakukan apa pun untuk ref yang tidak pernah dipotong", async () => {
    const user = await newUserWithBonus();
    expect(await refundCredits({ userId: user.id, ref: "tidak-ada" })).toEqual({
      status: "not_found",
      balance: 10,
    });
  });
});

describe("keamanan ledger", () => {
  it("klien tidak bisa menulis ke credit_ledger", async () => {
    const user = await newUserWithBonus();
    const { error } = await userClient(backend.url, user.accessToken)
      .from("credit_ledger")
      .insert({ user_id: user.id, delta: 1000, reason: "admin" });
    expect(error).not.toBeNull();
    expect(await getBalance(user.id)).toBe(10);
  });

  it("klien tidak bisa memanggil fungsi kredit langsung", async () => {
    const user = await newUserWithBonus();
    const client = userClient(backend.url, user.accessToken);
    const grant = await client.rpc("credits_grant_signup_bonus", {
      p_user: user.id,
      p_amount: 1000,
    });
    const refund = await client.rpc("credits_refund", { p_user: user.id, p_ref: "x" });
    expect(grant.error).not.toBeNull();
    expect(refund.error).not.toBeNull();
    expect(await getBalance(user.id)).toBe(10);
  });

  it("pengguna hanya melihat ledger miliknya", async () => {
    const a = await newUserWithBonus();
    await newUserWithBonus();
    const { data } = await userClient(backend.url, a.accessToken)
      .from("credit_ledger")
      .select("user_id");
    expect(data?.length).toBe(1);
    expect(data?.every((row) => row.user_id === a.id)).toBe(true);
  });
});
