# Rencana Task

Lima fase berurutan; setiap fase berakhir dengan sesuatu yang bisa dibuka di browser, lalu Claude berhenti untuk review kamu sebelum fase berikutnya.

Aturan semua fase: task baru boleh dicentang hanya setelah `pnpm lint`, `pnpm typecheck`, dan `pnpm build` lulus; tidak ada secret di repo; satu commit per task.

## Fase 0: Fondasi dan situs marketing (P-01, P-02, P-03, P-08)

**Selesai bila:** semua halaman publik bisa dibuka, daftar dan masuk berfungsi, `/app` menampilkan portal dengan 5 kartu modul berstatus Segera, dan workspace shell kosong tampil.

- [x] Init Next.js + TypeScript + Tailwind + shadcn/ui, ESLint, Prettier, pnpm
- [x] Buat `config/brand.ts`, `config/modules.ts`, dan token CSS dari Design System
- [ ] Layout marketing: bar pengumuman, nav dengan menu Modul, footer empat kolom
- [ ] Halaman `/`, `/modul`, `/modul/[slug]`, `/harga`, `/contoh`, `/faq`, `/kontak`, `/syarat`, `/privasi` dengan konten placeholder yang jujur
- [ ] Proyek Supabase, auth email + Google, halaman `/masuk`, `/daftar`, `/lupa-password`, middleware yang melindungi `/app`
- [ ] Tabel `profiles` dan trigger saat pengguna daftar
- [ ] Portal `/app` membaca manifest; workspace shell (sidebar, topbar, dua panel, tab mobile)
- [ ] README: cara menjalankan lokal dan daftar variabel env

## Fase 1: Kredit, library, lapisan AI, PRD Mini (P-04, P-05, M5-01)

**Selesai bila:** pengguna baru mendapat 10 kredit, PRD Mini menghasilkan dokumen yang tersimpan di library, dan batas 3 per hari berlaku di server.

- [ ] Migrasi `credit_ledger`, `generations`, `assets`, `usage_limits` beserta RLS
- [ ] `lib/credits`: saldo, spend transaksional dan idempoten, refund, bonus daftar
- [ ] `lib/ai/text.ts` dengan satu provider, validasi zod, retry satu kali, timeout
- [ ] Endpoint `/api/ai/prd` dengan rate limit dan batas harian
- [ ] UI modul PRD Mini: input, hasil, salin, simpan
- [ ] Library `/app/library` dan halaman `/app/kredit` (saldo dan riwayat ledger)
- [ ] Tes unit ledger: saldo tidak bisa negatif, spend idempoten

## Fase 2: Konten Studio dan Listing Optimizer (M1-01, M1-02, M3-01)

**Selesai bila:** Prompt Builder berjalan, gambar punya preview ber-watermark dan unduhan penuh memotong kredit, dan Listing Optimizer mematuhi batas karakter tiap platform.

- [ ] Prompt Builder: pilihan jenis produk, gaya, rasio, platform menghasilkan prompt; tombol salin
- [ ] `lib/ai/image.ts` dengan satu provider, simpan ke Storage, watermark pada preview
- [ ] Unduh resolusi penuh memanggil `/api/credits/spend`
- [ ] Batas preview harian lewat `usage_limits`
- [ ] Listing Optimizer untuk Shopee, Tokopedia, TikTok Shop dengan batas karakter dan tombol salin per bagian
- [ ] Halaman `/modul/konten` dan `/modul/listing` diisi contoh hasil nyata

## Fase 3: Clip Finder dan Halaman UMKM (M4-01, M2-01, M2-02, M2-03)

**Selesai bila:** dari transkrip keluar minimal 5 momen dengan timestamp valid, dan dari form keluar halaman dari template dengan preview gratis dan publish yang memotong 100 kredit.

- [ ] Clip Finder: tempel teks atau unggah `.srt` / `.vtt`, validasi timestamp terhadap transkrip, keluarkan hook dan caption
- [ ] 5 template halaman sebagai komponen React, bukan HTML bebas
- [ ] Form brief maksimal 8 isian dengan validasi nomor WA
- [ ] Generate copy per section lalu render ke template; pengguna bisa ubah teks, warna, urutan section
- [ ] Publish: slug unik, URL publik atau unduh HTML, tombol order WhatsApp
- [ ] Tabel `pages` dan halaman publik `/p/[slug]` yang hanya merender teks

## Fase 4: Pembayaran, admin, rilis (P-06, P-07)

**Selesai bila:** top-up sungguhan menambah saldo lewat webhook, admin bisa mematikan modul, dan checklist rilis lulus.

- [ ] Tanya pemilik: Midtrans atau Xendit; buat adapter di `lib/payments`
- [ ] Paket top-up awal (tebakan, konfirmasi ke pemilik): Rp25.000 = 50 kredit, Rp100.000 = 220 kredit, Rp250.000 = 600 kredit
- [ ] Webhook: verifikasi tanda tangan, idempoten per `provider_ref`
- [ ] Admin minimal dan feature flag per modul
- [ ] Hitung ulang biaya kredit terhadap biaya API sebenarnya
- [ ] Analytics dasar, error monitoring, halaman galat yang ramah
- [ ] Checklist rilis: RLS diuji, rate limit aktif, env produksi, domain, backup database
