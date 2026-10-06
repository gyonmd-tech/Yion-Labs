# Arsitektur

Satu repo Next.js melayani situs marketing, dashboard, dan API; Supabase menyimpan data serta login, dan setiap panggilan AI lewat satu lapisan provider yang memotong kredit melalui ledger.

> Diagram asli tidak ikut terekspor; versi teks disusun ulang dari isi dokumen ini.

```
Browser ──> Next.js di Vercel (marketing, /app, /api)
              ├── Supabase (Auth, Postgres + RLS, Storage)
              ├── Penyedia AI (teks, gambar) lewat lib/ai
              └── Penyedia pembayaran (Midtrans/Xendit) ──webhook──> /api/webhooks/payment
```

Ledger, hasil generate, dan file disimpan di Supabase; modul Kredit adalah satu-satunya yang boleh menulis saldo.

## Peta rute

| Route | Isi | Akses |
| --- | --- | --- |
| `/` | Beranda: hero, modul, cara kerja, harga ringkas | Publik |
| `/modul` dan `/modul/[slug]` | Daftar modul dan halaman penjelasan per modul dengan contoh hasil | Publik |
| `/harga`, `/contoh`, `/faq`, `/kontak` | Paket kredit, galeri hasil, tanya jawab, kontak | Publik |
| `/syarat`, `/privasi` | Halaman legal | Publik |
| `/masuk`, `/daftar`, `/lupa-password` | Autentikasi | Publik |
| `/app` | Portal: kartu semua modul, saldo kredit, aktivitas terakhir | Login |
| `/app/[module]` | Workspace modul (`konten`, `listing`, `klip`, `halaman`, `prd`) | Login |
| `/app/[module]/[id]` | Detail atau editor satu hasil | Login |
| `/app/library`, `/app/kredit`, `/app/akun` | Semua hasil, saldo dan top-up, profil | Login |
| `/admin` | Admin minimal | Role admin |
| `/api/ai/[module]`, `/api/credits/spend`, `/api/webhooks/payment` | Endpoint server | Sesi atau tanda tangan webhook |

## Struktur folder

```
/app
  /(marketing)   situs publik multipage
  /(auth)        masuk, daftar
  /app           portal + workspace
  /admin
  /api
/modules
  /konten /listing /klip /halaman /prd
    manifest.ts  slug, nama, ikon, biaya, status
    schema.ts    skema zod input dan output
    prompt.ts    semua prompt modul
    ui/          komponen workspace modul
/lib
  /ai            text.ts, image.ts, providers/
  /credits       ledger.ts
  /supabase      klien server dan browser
  /payments      adapter pembayaran
/components      ui/, shell/, marketing/
/config          brand.ts, modules.ts, pricing.ts
/docs
```

Modul baru = satu folder di `/modules` + satu entri di `config/modules.ts`. Portal dan sidebar membaca manifest itu, jadi tidak ada kode portal yang diubah saat menambah modul.

## Database

| Tabel | Kolom penting | Catatan |
| --- | --- | --- |
| `profiles` | id (= auth user), nama, role, created\_at | Dibuat otomatis saat daftar |
| `credit_ledger` | id, user\_id, delta (int), reason, ref\_id, created\_at | Hanya tambah baris; saldo = jumlah semua delta |
| `generations` | id, user\_id, module, input (jsonb), output (jsonb), status, cost\_credits, created\_at | Status: queued, done, failed |
| `assets` | id, generation\_id, user\_id, storage\_path, kind | Gambar dan file HTML di Storage |
| `pages` | id, user\_id, generation\_id, slug, template, published\_at | Khusus modul Halaman UMKM |
| `payments` | id, user\_id, provider, provider\_ref, amount\_idr, credits, status | Diisi webhook, unik per provider\_ref |
| `usage_limits` | user\_id, module, day, count | Batas harian PRD Mini dan preview gambar |

Nilai `reason` pada ledger: `signup_bonus`, `topup`, `spend`, `refund`, `admin`. Semua tabel memakai Row Level Security: pengguna hanya membaca baris miliknya, dan `credit_ledger` tidak bisa ditulis dari klien.

## Alur generate dan kredit

1. Klien mengirim `POST /api/ai/[module]` berisi input form.
2. Server memeriksa sesi, memvalidasi input dengan zod, dan memeriksa batas harian di `usage_limits`.
3. Server membuat baris `generations` berstatus `queued`, memanggil lapisan AI, memvalidasi output dengan zod, lalu menyimpannya sebagai `done`.
4. Modul teks (Prompt Builder, Listing, Clip Finder) memotong kredit pada langkah ini.
5. Modul gambar dan halaman menampilkan preview dulu; kredit dipotong lewat `POST /api/credits/spend` saat pengguna mengunduh atau publish. Preview dibatasi per hari agar biaya API terkendali.
6. `spend` berjalan dalam satu transaksi database: cek saldo, tulis baris ledger negatif, idempoten per `generation_id`. Gagal setelah terpotong = baris `refund`.

## Lapisan AI

- `lib/ai/text.ts` dan `lib/ai/image.ts` adalah satu-satunya pintu ke penyedia AI; provider dipilih lewat variabel env, bukan di kode modul.
- Prompt hidup di `modules/*/prompt.ts`, tidak ditulis inline di route handler.
- Setiap output model divalidasi dengan skema zod; satu kali retry, lalu gagal dengan pesan yang jelas.
- Kunci API hanya ada di server dan tidak pernah dikirim ke browser.

## Keamanan dan batas

- Rate limit per pengguna di semua endpoint `/api/ai`.
- Tanda tangan webhook pembayaran diverifikasi sebelum saldo diubah.
- Input pengguna selalu dianggap tidak tepercaya, termasuk teks yang masuk ke prompt.
- Halaman UMKM yang dipublikasikan hanya merender teks hasil dari template; tidak ada HTML atau skrip bebas dari pengguna.
