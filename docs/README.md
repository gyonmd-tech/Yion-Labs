# Labs AI Tools — Dokumen Pacuan Build

Oct 6, 2026 · @Giffani

## Cara Pakai & Keputusan Awal

Dokumen ini adalah satu-satunya sumber kebenaran untuk Claude saat membangun Labs AI Tools: baca berurutan Agent Rules, PRD, Arsitektur, Design System, lalu kerjakan Rencana Task satu fase per sesi.

1. Export doc ini ke Markdown, lalu pecah jadi `docs/prd.md`, `docs/architecture.md`, `docs/design-system.md`, `docs/plan-task.md`, dan `docs/agent-rules.md` di repo kosong.
2. Salin bagian Agent Rules ke `CLAUDE.md` di root repo agar terbaca otomatis di setiap sesi.
3. Mulai setiap sesi dengan prompt di bawah. Satu sesi = satu fase; Claude berhenti di akhir fase dan menunggu review kamu.

```
Baca CLAUDE.md dan semua file di /docs. Kerjakan HANYA Fase <N> dari docs/plan-task.md.
Centang task yang selesai, jalankan lint + typecheck + build, lalu berhenti dan ringkas hasilnya.
Jika ada keputusan yang tidak tercakup dokumen, tanyakan. Jangan menebak.
```

Keputusan berikut saya ambil supaya Claude tidak perlu bertanya di awal. Semuanya bisa kamu ubah sebelum Fase 0 dimulai.

| Keputusan | Pilihan | Alasan |
| --- | --- | --- |
| Nama kerja | "Labs" (placeholder) | Diganti lewat satu file `config/brand.ts` |
| Framework | Next.js App Router + TypeScript | Satu repo untuk marketing, dashboard, dan API |
| UI | Tailwind + shadcn/ui | Cepat, konsisten, mudah dipahami Claude |
| Backend | Supabase (Auth, Postgres, Storage) | Login, database, dan file dalam satu layanan |
| AI | Lapisan provider abstrak (teks dan gambar terpisah) | Model dan harga cepat berubah, jangan dikunci |
| Pembayaran | Midtrans atau Xendit, dipilih di Fase 4 | QRIS, VA, dan e-wallet untuk pasar Indonesia |
| Model bisnis | Kredit prabayar, bukan langganan | Pemakaian pengguna UMKM tidak rutin |
| Bahasa UI | Indonesia | Target UMKM dan content creator |
| Hosting | Vercel | Sudah kamu pakai |

Lemon Squeezy hanya dipakai sebagai referensi tampilan, bukan penyedia pembayaran. Semua angka harga dan kredit di PRD adalah tebakan awal untuk diuji, bukan hasil riset pasar.
