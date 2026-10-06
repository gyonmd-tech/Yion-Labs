/**
 * Server Supabase tiruan untuk tes dan uji lokal tanpa proyek Supabase.
 *
 * - Database: PGlite (Postgres di dalam proses) dengan migrasi asli dari
 *   supabase/migrations dan skema auth tiruan (tests/db/auth-stub.sql).
 * - REST: subset PostgREST yang dipakai aplikasi (select/insert/update/delete
 *   dengan filter eq/neq/is/in, order, limit, single/maybeSingle, count, rpc).
 * - Auth: subset GoTrue (signup, login password, refresh, user, logout, recover).
 *
 * Permintaan dengan service key berjalan sebagai superuser (melewati RLS, seperti
 * service_role). Permintaan dengan token pengguna berjalan sebagai peran
 * `authenticated` dengan auth.uid() terisi, sehingga RLS benar-benar diuji.
 *
 * Hanya untuk tes. Token tidak ditandatangani dengan aman.
 */
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { PGlite, type Transaction } from "@electric-sql/pglite";

export const FAKE_ANON_KEY = "fake-anon-key";
export const FAKE_SERVICE_KEY = "fake-service-role-key";

type Caller = { kind: "service" } | { kind: "anon" } | { kind: "user"; userId: string };

type FakeUser = {
  id: string;
  email: string;
  password: string;
  user_metadata: Record<string, unknown>;
  created_at: string;
};

const IDENT = /^[a-z_][a-z0-9_]*$/;

function ident(name: string): string {
  if (!IDENT.test(name)) throw new HttpError(400, "PGRST100", `Nama tidak valid: ${name}`);
  return `"${name}"`;
}

class HttpError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function b64url(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function makeAccessToken(user: { id: string; email: string }) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({
    sub: user.id,
    email: user.email,
    exp,
    role: "authenticated",
    aud: "authenticated",
  })}.fake-signature`;
}

function decodeToken(token: string): { sub?: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as { sub?: string };
  } catch {
    return null;
  }
}

export async function createFakeDatabase(root = process.cwd()) {
  // Tipe date (1082) dikembalikan sebagai string YYYY-MM-DD seperti PostgREST.
  const db = await PGlite.create({ parsers: { 1082: (v: string) => v } });
  await db.exec(fs.readFileSync(path.join(root, "tests/db/auth-stub.sql"), "utf8"));
  const dir = path.join(root, "supabase/migrations");
  for (const file of fs.readdirSync(dir).sort()) {
    await db.exec(fs.readFileSync(path.join(dir, file), "utf8"));
  }
  return db;
}

function parseFilters(params: URLSearchParams) {
  const where: string[] = [];
  const values: unknown[] = [];
  for (const [key, raw] of params) {
    if (["select", "order", "limit", "offset", "columns", "on_conflict"].includes(key)) continue;
    const column = ident(key);
    const dot = raw.indexOf(".");
    const op = raw.slice(0, dot);
    const value = raw.slice(dot + 1);
    if (op === "eq" || op === "neq") {
      values.push(value);
      where.push(`${column} ${op === "eq" ? "=" : "<>"} $${values.length}`);
    } else if (op === "is") {
      if (value !== "null")
        throw new HttpError(400, "PGRST100", `Filter is.${value} belum didukung`);
      where.push(`${column} is null`);
    } else if (op === "in") {
      const items = value
        .replace(/^\(|\)$/g, "")
        .split(",")
        .filter(Boolean);
      const placeholders = items.map((item) => {
        values.push(item.replace(/^"|"$/g, ""));
        return `$${values.length}`;
      });
      where.push(placeholders.length ? `${column} in (${placeholders.join(", ")})` : "false");
    } else {
      throw new HttpError(400, "PGRST100", `Operator ${op} belum didukung`);
    }
  }
  return { where: where.length ? ` where ${where.join(" and ")}` : "", values };
}

function parseSelect(select: string | null) {
  if (!select || select === "*") return "*";
  return select
    .split(",")
    .map((c) => ident(c.trim()))
    .join(", ");
}

function parseOrder(order: string | null) {
  if (!order) return "";
  const parts = order.split(",").map((item) => {
    const [col, ...mods] = item.split(".");
    const dir = mods.includes("desc") ? "desc" : "asc";
    const nulls = mods.includes("nullsfirst")
      ? " nulls first"
      : mods.includes("nullslast")
        ? " nulls last"
        : "";
    return `${ident(col)} ${dir}${nulls}`;
  });
  return ` order by ${parts.join(", ")}`;
}

function toParam(value: unknown) {
  if (value !== null && typeof value === "object") return JSON.stringify(value);
  return value;
}

function pgErrorToHttp(error: unknown): HttpError {
  if (error instanceof HttpError) return error;
  const e = error as { code?: string; message?: string };
  if (e.code === "42501") return new HttpError(403, "42501", e.message ?? "permission denied");
  return new HttpError(400, e.code ?? "PGRST000", e.message ?? "database error");
}

async function withCaller<T>(db: PGlite, caller: Caller, fn: (tx: Transaction) => Promise<T>) {
  return db.transaction(async (tx) => {
    if (caller.kind === "user") {
      await tx.exec(
        `set local role authenticated; select set_config('request.jwt.claim.sub', '${caller.userId}', true);`,
      );
    } else if (caller.kind === "anon") {
      await tx.exec("set local role anon;");
    }
    return fn(tx);
  });
}

export async function startFakeSupabase(options: { port?: number; root?: string } = {}) {
  const db = await createFakeDatabase(options.root);
  const users = new Map<string, FakeUser>();
  const refreshTokens = new Map<string, string>();
  const procRetset = new Map<string, boolean>();

  async function createUser(input: { email: string; password?: string; name?: string }) {
    const user: FakeUser = {
      id: randomUUID(),
      email: input.email.toLowerCase(),
      password: input.password ?? "password123",
      user_metadata: input.name ? { full_name: input.name } : {},
      created_at: new Date().toISOString(),
    };
    await db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)", [
      user.id,
      user.email,
      JSON.stringify(user.user_metadata),
    ]);
    users.set(user.id, user);
    return { ...user, accessToken: makeAccessToken(user) };
  }

  function publicUser(user: FakeUser) {
    return {
      id: user.id,
      aud: "authenticated",
      role: "authenticated",
      email: user.email,
      email_confirmed_at: user.created_at,
      user_metadata: user.user_metadata,
      app_metadata: { provider: "email", providers: ["email"] },
      identities: [],
      created_at: user.created_at,
      updated_at: user.created_at,
    };
  }

  function session(user: FakeUser) {
    const refresh = randomUUID();
    refreshTokens.set(refresh, user.id);
    return {
      access_token: makeAccessToken(user),
      token_type: "bearer",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: refresh,
      user: publicUser(user),
    };
  }

  function callerFrom(req: http.IncomingMessage): Caller {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "") ?? "";
    if (bearer === FAKE_SERVICE_KEY) return { kind: "service" };
    if (!bearer || bearer === FAKE_ANON_KEY) return { kind: "anon" };
    const claims = decodeToken(bearer);
    if (!claims?.sub || !users.has(claims.sub))
      throw new HttpError(401, "PGRST301", "JWT tidak valid");
    return { kind: "user", userId: claims.sub };
  }

  async function isSetReturning(fn: string) {
    if (!procRetset.has(fn)) {
      const r = await db.query<{ proretset: boolean }>(
        "select proretset from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = $1",
        [fn],
      );
      if (!r.rows[0]) throw new HttpError(404, "PGRST202", `Fungsi ${fn} tidak ditemukan`);
      procRetset.set(fn, r.rows[0].proretset);
    }
    return procRetset.get(fn) as boolean;
  }

  async function handleRest(req: http.IncomingMessage, url: URL, body: unknown) {
    const caller = callerFrom(req);
    const segments = url.pathname.replace(/^\/rest\/v1\//, "").split("/");
    const prefer = String(req.headers.prefer ?? "");
    const wantsObject = String(req.headers.accept ?? "").includes("vnd.pgrst.object");

    if (segments[0] === "rpc") {
      const fn = ident(segments[1]).slice(1, -1);
      const args = (body ?? {}) as Record<string, unknown>;
      const names = Object.keys(args);
      const call = `public.${ident(fn)}(${names.map((n, i) => `${ident(n)} => $${i + 1}`).join(", ")})`;
      const values = names.map((n) => toParam(args[n]));
      const setReturning = await isSetReturning(fn);
      const rows = await withCaller(db, caller, async (tx) =>
        setReturning
          ? (await tx.query(`select * from ${call}`, values)).rows
          : (await tx.query<{ v: unknown }>(`select ${call} as v`, values)).rows,
      );
      return { status: 200, data: setReturning ? rows : (rows[0] as { v: unknown }).v };
    }

    const table = `public.${ident(segments[0])}`;
    const select = parseSelect(url.searchParams.get("select"));
    const { where, values } = parseFilters(url.searchParams);
    const returning = prefer.includes("return=representation") || url.searchParams.has("select");
    let rows: Record<string, unknown>[] = [];

    if (req.method === "GET" || req.method === "HEAD") {
      const limit = url.searchParams.get("limit");
      const offset = url.searchParams.get("offset");
      let sql = `select ${select} from ${table}${where}${parseOrder(url.searchParams.get("order"))}`;
      if (limit) sql += ` limit ${Number.parseInt(limit, 10)}`;
      if (offset) sql += ` offset ${Number.parseInt(offset, 10)}`;
      rows = await withCaller(
        db,
        caller,
        async (tx) => (await tx.query<Record<string, unknown>>(sql, values)).rows,
      );
    } else if (req.method === "POST") {
      const items = (Array.isArray(body) ? body : [body]) as Record<string, unknown>[];
      rows = await withCaller(db, caller, async (tx) => {
        const out: Record<string, unknown>[] = [];
        for (const item of items) {
          const cols = Object.keys(item);
          const sql = `insert into ${table} (${cols.map(ident).join(", ")}) values (${cols
            .map((_, i) => `$${i + 1}`)
            .join(", ")}) returning ${select}`;
          out.push(
            ...(
              await tx.query<Record<string, unknown>>(
                sql,
                cols.map((c) => toParam(item[c])),
              )
            ).rows,
          );
        }
        return out;
      });
    } else if (req.method === "PATCH") {
      const patch = body as Record<string, unknown>;
      const cols = Object.keys(patch);
      const offset = values.length;
      const sets = cols.map((c, i) => `${ident(c)} = $${offset + i + 1}`).join(", ");
      const sql = `update ${table} set ${sets}${where} returning ${select}`;
      rows = await withCaller(
        db,
        caller,
        async (tx) =>
          (
            await tx.query<Record<string, unknown>>(sql, [
              ...values,
              ...cols.map((c) => toParam(patch[c])),
            ])
          ).rows,
      );
    } else if (req.method === "DELETE") {
      rows = await withCaller(
        db,
        caller,
        async (tx) =>
          (
            await tx.query<Record<string, unknown>>(
              `delete from ${table}${where} returning ${select}`,
              values,
            )
          ).rows,
      );
    } else {
      throw new HttpError(405, "PGRST000", "Metode tidak didukung");
    }

    const headers: Record<string, string> = {};
    if (prefer.includes("count="))
      headers["content-range"] = `0-${Math.max(rows.length - 1, 0)}/${rows.length}`;

    if (req.method !== "GET" && !returning)
      return { status: req.method === "POST" ? 201 : 204, data: undefined, headers };
    if (wantsObject) {
      if (rows.length !== 1) {
        throw new HttpError(406, "PGRST116", `JSON object requested, ${rows.length} rows returned`);
      }
      return { status: 200, data: rows[0], headers };
    }
    return { status: req.method === "POST" ? 201 : 200, data: rows, headers };
  }

  async function handleAuth(req: http.IncomingMessage, url: URL, body: Record<string, unknown>) {
    const route = url.pathname.replace(/^\/auth\/v1/, "");
    if (route === "/signup" && req.method === "POST") {
      const email = String(body.email ?? "").toLowerCase();
      if ([...users.values()].some((u) => u.email === email)) {
        throw new HttpError(422, "user_already_exists", "User already registered");
      }
      const data = (body.data ?? {}) as { full_name?: string };
      const created = await createUser({
        email,
        password: String(body.password),
        name: data.full_name,
      });
      return { status: 200, data: session(users.get(created.id) as FakeUser) };
    }
    if (route === "/token" && req.method === "POST") {
      const grant = url.searchParams.get("grant_type");
      if (grant === "password") {
        const user = [...users.values()].find(
          (u) => u.email === String(body.email).toLowerCase() && u.password === body.password,
        );
        if (!user) throw new HttpError(400, "invalid_credentials", "Invalid login credentials");
        return { status: 200, data: session(user) };
      }
      if (grant === "refresh_token") {
        const userId = refreshTokens.get(String(body.refresh_token));
        const user = userId ? users.get(userId) : undefined;
        if (!user) throw new HttpError(400, "refresh_token_not_found", "Invalid Refresh Token");
        return { status: 200, data: session(user) };
      }
    }
    if (route === "/user" && req.method === "GET") {
      const caller = callerFrom(req);
      if (caller.kind !== "user") throw new HttpError(401, "no_authorization", "Unauthorized");
      return { status: 200, data: publicUser(users.get(caller.userId) as FakeUser) };
    }
    if (route === "/logout") return { status: 204, data: undefined };
    if (route === "/recover") return { status: 200, data: {} };
    throw new HttpError(404, "not_found", `Auth route ${route} tidak didukung`);
  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const raw = Buffer.concat(chunks).toString("utf8");
    let parsedBody: unknown;
    try {
      parsedBody = raw ? JSON.parse(raw) : undefined;
    } catch {
      parsedBody = undefined;
    }
    try {
      const result = url.pathname.startsWith("/rest/v1/")
        ? await handleRest(req, url, parsedBody)
        : url.pathname.startsWith("/auth/v1/")
          ? await handleAuth(req, url, (parsedBody ?? {}) as Record<string, unknown>)
          : (() => {
              throw new HttpError(404, "not_found", "Not found");
            })();
      res.writeHead(result.status, {
        "content-type": "application/json",
        ...("headers" in result ? result.headers : {}),
      });
      res.end(result.data === undefined ? "" : JSON.stringify(result.data));
    } catch (error) {
      const e =
        url.pathname.startsWith("/auth/") && error instanceof HttpError
          ? error
          : pgErrorToHttp(error);
      res.writeHead(e.status, { "content-type": "application/json" });
      res.end(
        JSON.stringify(
          url.pathname.startsWith("/auth/")
            ? { code: e.status, error_code: e.code, msg: e.message }
            : { code: e.code, message: e.message, details: null, hint: null },
        ),
      );
    }
  });

  await new Promise<void>((resolve) => server.listen(options.port ?? 0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  return {
    url: `http://127.0.0.1:${port}`,
    port,
    db,
    createUser,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
