# Labs AI Tools

Portal alat AI berbasis kredit untuk UMKM dan content creator Indonesia. "Labs" masih nama kerja; ganti di `config/brand.ts`.

Dokumen produk ada di [`docs/`](docs/) (PRD, arsitektur, design system, rencana task), dan aturan kerja agent ada di [`CLAUDE.md`](CLAUDE.md).

## Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind CSS 4 + shadcn/ui (Radix)
- Supabase: Auth, Postgres, Storage
- Zod untuk validasi env, input, dan output
- pnpm

## Menjalankan lokal

Prasyarat: Node.js 20.9 atau lebih baru (disarankan 22) dan pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # lalu isi nilainya
pnpm dev                     # http://localhost:3000
```

Halaman marketing bisa dibuka tanpa env. Halaman auth dan `/app` butuh proyek Supabase.

### Variabel env

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL proyek, dari Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Anon (public) key dari halaman yang sama |
| `NEXT_PUBLIC_SITE_URL` | Tidak | URL situs untuk tautan email dan redirect Google. Default `http://localhost:3000` |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya | Service role key (Project Settings → API). Hanya dipakai di server untuk ledger kredit, hasil generate, dan batas pemakaian |
| `AI_TEXT_PROVIDER` | Ya | `anthropic` untuk Claude, atau `mock` untuk data tiruan berlabel `[TIRUAN]` saat pengembangan |
| `ANTHROPIC_API_KEY` | Bila `anthropic` | Kunci API dari console.anthropic.com |
| `AI_TEXT_MODEL` | Tidak | Model teks. Default `claude-opus-5-5` |

Semua env dibaca lewat `lib/env.ts` dan divalidasi dengan zod. Env server (service role, kunci AI) tidak pernah dikirim ke browser. Jangan commit `.env.local`.

### Menyiapkan Supabase

1. Buat proyek di [supabase.com](https://supabase.com), lalu isi dua variabel Supabase di `.env.local`.
2. Jalankan migrasi di `supabase/migrations/` secara berurutan: tempel isinya di SQL Editor, atau jalankan `supabase link` lalu `supabase db push` dengan Supabase CLI.
   - `20261006000000_profiles.sql`: profil pengguna dan trigger saat daftar
   - `20261007000000_credits_generations.sql`: ledger kredit, hasil generate, aset, batas harian, rate limit, dan fungsi-fungsinya
3. Buka Authentication → URL Configuration:
   - **Site URL**: `http://localhost:3000` (produksi: domain kamu)
   - **Redirect URLs**: tambahkan `http://localhost:3000/auth/callback` dan versi produksinya
4. Login Google: aktifkan provider Google di Authentication → Providers, lalu isi Client ID dan Client Secret dari Google Cloud Console. Di Google Cloud, tambahkan `https://<project-ref>.supabase.co/auth/v1/callback` sebagai authorized redirect URI.
5. Opsional: supaya tautan konfirmasi dan reset tetap jalan saat dibuka di browser lain, ubah template email agar memakai token hash, misalnya untuk Reset Password:
   `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&next=/atur-password`

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `pnpm dev` | Server pengembangan |
| `pnpm build` / `pnpm start` | Build dan jalankan versi produksi |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Generate tipe rute lalu `tsc --noEmit` |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm test` | Vitest: lapisan AI, endpoint PRD Mini, dan ledger kredit |

Setiap task wajib lulus `pnpm lint`, `pnpm typecheck`, dan `pnpm build`.

### Tes dan Supabase tiruan

`pnpm test` tidak butuh proyek Supabase. Tes memakai `tests/support/fake-supabase.ts`: Postgres di dalam proses (PGlite) dengan migrasi asli, ditambah tiruan sebagian API REST dan Auth Supabase. Permintaan atas nama pengguna berjalan sebagai peran `authenticated`, jadi RLS ikut teruji.

Server tiruan yang sama bisa dipakai untuk mencoba aplikasi tanpa Supabase:

```bash
node tests/support/fake-supabase-server.mts   # http://127.0.0.1:54321, data hilang saat dihentikan
```

Lalu isi `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=fake-anon-key
SUPABASE_SERVICE_ROLE_KEY=fake-service-role-key
AI_TEXT_PROVIDER=mock
```

Daftar akun lewat `/daftar` seperti biasa. Login Google dan email sungguhan tetap butuh Supabase asli.

## Struktur

```
app/
  (marketing)/   situs publik: /, /modul, /harga, /contoh, /faq, /kontak, /syarat, /privasi
  (auth)/        /masuk, /daftar, /lupa-password, /atur-password + Server Actions
  auth/          /auth/callback (OAuth dan tautan email), /auth/keluar (POST)
  app/           portal /app, workspace /app/[module], /app/library, /app/kredit
  api/ai/        endpoint generate per modul (mis. /api/ai/prd)
modules/<slug>/  manifest.ts, schema.ts, prompt.ts, ui/ per modul
config/          brand.ts, modules.ts
content/         semua teks UI berbahasa Indonesia
components/      ui/ (shadcn), shell/ (aplikasi), marketing/
lib/             env.ts, supabase/, auth/, modules/, credits/ (satu-satunya penulis saldo),
                 ai/ (text.ts + providers/), generations/, usage/ (batas harian, rate limit)
supabase/        migrations/
tests/           Vitest + Supabase tiruan
proxy.ts         penyegar sesi + pelindung /app (pengganti middleware di Next.js 16)
```

Untuk menambah modul, buat folder di `modules/` dan tambahkan satu entri di `config/modules.ts`. Portal, sidebar, menu, dan halaman marketing akan membacanya otomatis.

## Catatan Next.js 16

- `middleware.ts` sekarang bernama `proxy.ts`.
- `params` dan `searchParams` bersifat async (`await props.params`).
- `next build` tidak lagi menjalankan lint, jadi `pnpm lint` dijalankan terpisah.
