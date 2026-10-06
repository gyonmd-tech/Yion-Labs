# Design System & Referensi UI

Labs meminjam struktur dan ritme halaman [Lemon Squeezy](https://www.lemonsqueezy.com/) (dibaca 6 Oktober 2026): nav lengket dengan menu besar, hero satu CTA, bagian bernomor, dan footer empat kolom. Identitas visualnya tetap milik Labs; jangan menyalin logo, ilustrasi, foto, atau teks mereka.

## Pola yang diambil dari referensi

| Pola di referensi | Penerapan di Labs |
| --- | --- |
| Bar pengumuman di atas nav | Satu baris dengan tautan, misalnya "10 kredit gratis untuk pengguna baru" |
| Nav lengket, menu besar per kolom, "Sign in" teks + "Get started" solid | Menu **Modul** berisi 5 modul dengan deskripsi satu baris; lalu Harga, Contoh, Bantuan; kanan: Masuk (teks) + Mulai Gratis (solid) |
| Hero: judul besar, satu kalimat, satu CTA, grafik besar di bawah | H1, satu kalimat, satu CTA "Coba gratis", mockup portal di bawahnya |
| Baris logo "trusted by" | Ganti dengan angka nyata (jumlah hasil dibuat); kosongkan sampai ada data |
| Bagian bernomor 01 sampai 06 dengan gambar | "Kenapa Labs": 4 bagian bernomor, masing-masing dengan contoh hasil |
| Label kecil huruf kecil di atas H2, frasa penting ditebalkan di paragraf | Pola yang sama di setiap section marketing |
| Grid 6 kartu bernomor untuk fitur | Grid modul M1 sampai M5 |
| Testimoni dan studi kasus | Tampilkan hanya yang nyata; jangan membuat testimoni palsu |
| Panduan gratis sebagai lead magnet | Kartu "PRD Mini gratis" yang mengarah ke modul M5 |
| CTA penutup + footer empat kolom | Footer: Modul, Sumber Daya, Perusahaan, Legal |

Urutan section Beranda: bar pengumuman, hero, angka hasil, Kenapa Labs (4 bagian bernomor), grid modul, cara kerja (3 langkah), contoh hasil, harga ringkas, FAQ, CTA penutup, footer.

## Token

Nilai awal; simpan semuanya sebagai CSS variable di satu file agar mudah diganti, dan tambahkan mode gelap nanti tanpa mengubah komponen.

| Token | Nilai awal | Catatan |
| --- | --- | --- |
| `--primary` | `#5B3DF5` | Tombol utama, tautan, aksen angka bagian |
| `--bg` / `--bg-subtle` | `#FFFFFF` / `#F7F6FB` | Latar halaman dan latar selang-seling section |
| `--text` / `--text-muted` | `#14121F` / `#6B6880` | Kontras minimal AA |
| `--border` | `#E6E4F0` | Garis 1 px kartu dan input |
| `--success` / `--warning` / `--danger` | `#12A150` / `#E8A200` / `#DC3545` | Status hasil dan pesan galat |
| Font | Plus Jakarta Sans (judul), Inter (isi) | Lewat `next/font`, tanpa muat dari CDN |
| Skala teks | H1 56/60, H2 40/44, H3 24/32, isi 16/26, kecil 14/20 | H1 dan H2 turun ke 36/40 dan 28/34 di mobile |
| Layout | Kontainer maks 1200 px; jarak section 96 px (mobile 56 px) | Kelipatan 4 px |
| Radius | Kartu 16 px, tombol dan input 10 px | Bayangan hanya saat kartu di-hover |
| Breakpoint | 375, 768, 1024, 1280 px | Desain mobile dulu |

Komponen wajib (shadcn/ui yang disesuaikan): Button (utama, outline, ghost), Card, ModuleCard, Badge (status modul dan biaya kredit), CreditPill, Input, Textarea, Select, Tabs, Dialog, Toast, Skeleton, EmptyState.

## Portal modul (`/app`)

- Baris atas: salam singkat, saldo kredit, tombol Top-up.
- Grid kartu modul dari manifest: ikon, nama, satu baris fungsi, biaya mulai dari, dan status Aktif, Beta, atau Segera. Kartu Segera tidak bisa diklik.
- Baris "Lanjutkan": tiga hasil terakhir lintas modul.

## Workspace modul (`/app/[module]`)

Semua modul memakai kerangka yang sama; hanya isi panel input dan panel hasil yang berbeda.

> Diagram asli tidak ikut terekspor; versi teks disusun ulang dari isi dokumen ini.

```
┌──────────┬───────────────────────────────────────────┐
│          │ Topbar: breadcrumb · saldo kredit · avatar │
│ Sidebar  ├─────────────────────┬─────────────────────┤
│ modul    │ Panel input         │ Panel hasil         │
│ (240 px) │                     │                     │
└──────────┴─────────────────────┴─────────────────────┘
```

Saldo kredit selalu terlihat di topbar; panel input dan panel hasil adalah satu-satunya area yang berbeda antar modul.

- Sidebar 240 px; di bawah 1024 px menciut jadi ikon, di mobile menjadi drawer.
- Topbar 56 px berisi breadcrumb, saldo kredit, dan avatar.
- Desktop memakai dua panel (input di kiri, hasil di kanan); mobile memakai tab Input | Hasil.
- Setiap modul wajib punya tampilan kosong, memuat (skeleton dan perkiraan waktu), galat (dengan tombol coba lagi), dan biaya kredit yang terlihat sebelum aksi yang memotong saldo. Aksi 50 kredit atau lebih meminta konfirmasi.

## Gaya bahasa dan aksesibilitas

- Bahasa Indonesia santai tapi jelas, memakai "kamu", kata kerja aktif, tanpa istilah teknis AI di tombol dan judul.
- Semua kontrol bisa dipakai dengan keyboard, fokus terlihat jelas, target sentuh minimal 44 px.
- Gambar dekoratif memakai alt kosong; gambar hasil memakai alt dari input pengguna.
