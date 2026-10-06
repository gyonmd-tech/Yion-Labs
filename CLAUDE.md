# CLAUDE.md — Labs AI Tools

Sumber kebenaran ada di `/docs`: `prd.md`, `architecture.md`, `design-system.md`, `plan-task.md`, `agent-rules.md` (keputusan awal di `docs/README.md`). Baca semuanya di awal setiap sesi.


Aturan ini berlaku di setiap sesi; jika permintaan di chat bertentangan dengannya, Claude bertanya dulu sebelum bertindak.

## Cara kerja

- Baca `CLAUDE.md` dan semua file di `/docs` di awal sesi; dokumen adalah sumber kebenaran.
- Kerjakan hanya fase yang diminta dan jangan mulai fase berikutnya.
- Ubah sesedikit mungkin; jangan refactor di luar task.
- Keputusan yang tidak tercakup dokumen: tanya, jangan menebak. Kumpulkan pertanyaan dan sampaikan di akhir sesi.
- Jangan mencentang task yang belum dijalankan atau diuji. Jika sesuatu tidak bisa diuji di lingkungan ini, tulis jelas di laporan.
- Di akhir fase, centang task di `docs/plan-task.md` dan kirim laporan dengan format di bawah.

## Konvensi kode

- TypeScript strict, tanpa `any`; Zod untuk setiap batas sistem: input pengguna, output model, dan env.
- Server Components secara default; `"use client"` hanya bila ada interaksi.
- Nama kode (variabel, fungsi, file) berbahasa Inggris; teks UI berbahasa Indonesia dan disimpan di konstanta atau file copy, bukan di dalam logika.
- Satu modul = satu folder dan tidak mengimpor modul lain; kode bersama masuk `/lib` atau `/components`.
- Prompt hanya di `modules/*/prompt.ts`.
- Env dibaca lewat satu file `lib/env.ts` yang divalidasi zod.
- Komponen memakai token Design System; tidak ada warna atau ukuran ad hoc.

## Keamanan (wajib)

- Jangan commit secret; `.env.local` ada di `.gitignore` dan `.env.example` selalu diperbarui.
- Kunci API AI dan service role Supabase hanya dipakai di server.
- Saldo hanya berubah lewat `lib/credits`; tidak ada kode lain yang menulis ke `credit_ledger`.
- Setiap tabel punya RLS, dan setiap migrasi baru menyertakan kebijakannya.
- Tanda tangan webhook diverifikasi sebelum diproses.
- Jangan memakai `dangerouslySetInnerHTML` untuk teks dari pengguna atau model.
- Anggap teks pengguna tidak tepercaya, termasuk saat dimasukkan ke prompt.

## Kualitas hasil AI dan konten

- Output model selalu divalidasi skema. Gagal setelah satu retry berarti pesan galat yang ramah dan tidak ada potongan kredit.
- Jangan menulis klaim yang belum benar di UI atau marketing: testimoni palsu, jumlah pengguna, atau logo klien.
- Contoh hasil tidak boleh meniru tokoh publik atau merek terdaftar.

## Perlu persetujuan pemilik dulu

- Menambah dependensi di luar stack tanpa menyebut alasannya.
- Mengubah tabel yang sudah ada di luar migrasi baru.
- Mengganti stack, mengubah harga atau biaya kredit, atau mengaktifkan pembayaran sungguhan.
- Menghapus data atau menjalankan perintah destruktif pada database.
- Deploy ke produksi.

## Format laporan akhir sesi

```
Fase: <N>
Selesai: <task yang dicentang>
Belum atau ditunda: <task dan alasannya>
Perintah dijalankan: lint, typecheck, build -> hasil
Pertanyaan untuk pemilik: <daftar>
Perlu dites manual: <hal yang tidak bisa diuji otomatis>
```
