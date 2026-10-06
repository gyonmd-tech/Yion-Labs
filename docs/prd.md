# PRD

Labs adalah portal alat AI berbasis kredit untuk UMKM dan content creator Indonesia: pengguna memilih modul di portal, bekerja di workspace modul itu, dan hanya membayar per hasil.

## Target pengguna dan masalah

- **Pemilik UMKM / penjual online:** butuh foto produk, copy, dan halaman jualan cepat tanpa agency.
- **Content creator / affiliate:** butuh prompt, skrip, dan ide klip yang konsisten setiap hari.
- **Freelancer / agency kecil:** butuh alat murah untuk dijual ulang ke klien.

Alat global berbahasa Inggris, berlangganan dalam USD, dan hasilnya sulit dinilai sebelum bayar. Labs menjawabnya dengan bahasa Indonesia, harga rupiah per hasil, dan preview sebelum bayar.

## Prinsip produk

1. Output harus bisa dinilai pengguna dalam hitungan detik.
2. Template dan batasan ketat, bukan generate bebas, supaya kualitas konsisten.
3. Gambar dan halaman punya preview gratis (dibatasi per hari) dan kredit dipotong saat unduh atau publish; modul teks memotong kredit kecil saat generate.
4. Satu akun, satu saldo kredit, banyak modul.

## Modul

Biaya kredit adalah tebakan awal. Sebelum Fase 4, hitung ulang terhadap biaya API sebenarnya dengan target margin kotor minimal 60%.

| ID | Modul | Input | Output | Biaya (kredit) | Fase |
| --- | --- | --- | --- | --- | --- |
| M5 | PRD Mini (lead magnet) | Ide produk satu paragraf | PRD satu halaman + potongan scope MVP | Gratis, batas 3 per hari | 1 |
| M1 | Konten Studio | Jenis produk, gaya, rasio | Prompt terstruktur; opsional gambar | Prompt 1; gambar 10 | 2 |
| M3 | Listing Optimizer | Nama produk, fitur, platform | Judul, deskripsi, keyword per platform | 3 | 2 |
| M4 | Clip Finder | Transkrip video | Momen terbaik + timestamp, hook, caption | 5 | 3 |
| M2 | Halaman UMKM | Form brief ala WhatsApp | Landing page dari template, siap publish | 100 | 3 |

## Fitur platform dan modul

| ID | Fitur | Kriteria selesai | Fase |
| --- | --- | --- | --- |
| P-01 | Auth email + Google | Daftar, masuk, keluar, reset password; rute dashboard terlindungi | 0 |
| P-02 | Portal modul | Halaman setelah login menampilkan kartu semua modul; kartu menuju workspace modul | 0 |
| P-03 | Workspace shell | Sidebar per modul, topbar dengan saldo kredit, responsif sampai 375 px | 0 |
| P-04 | Kredit dan ledger | Saldo hanya berubah lewat ledger; tidak bisa negatif; bonus daftar 10 kredit | 1 |
| P-05 | Library hasil | Semua hasil tersimpan, bisa difilter per modul, dibuka ulang, dan dihapus | 1 |
| P-06 | Top-up pembayaran | Pilih paket, bayar, saldo bertambah otomatis lewat webhook | 4 |
| P-07 | Admin minimal | Lihat pengguna, saldo, log error; matikan modul lewat feature flag | 4 |
| P-08 | Situs marketing multipage | Beranda, Modul, Harga, Contoh, FAQ, Kontak, Syarat, Privasi | 0 |
| M5-01 | Generate PRD Mini | Hasil muncul kurang dari 15 detik; batas harian ditegakkan di server | 1 |
| M1-01 | Prompt Builder | Pilihan terstruktur menghasilkan prompt; tombol salin | 2 |
| M1-02 | Generate gambar | Preview ber-watermark; unduh resolusi penuh memotong kredit | 2 |
| M3-01 | Optimizer listing | Output sesuai batas karakter tiap platform | 2 |
| M4-01 | Clip Finder | Minimal 5 momen dengan timestamp valid terhadap transkrip | 3 |
| M2-01 | Form brief halaman | Maksimal 8 isian; validasi nomor WA | 3 |
| M2-02 | Template halaman | 5 template; hanya teks, warna, dan urutan section yang bisa berubah | 3 |
| M2-03 | Publish halaman | Preview gratis; publish memotong 100 kredit dan menghasilkan URL publik atau file HTML | 3 |

## Di luar cakupan versi pertama

- Rendering video penuh (potong, subtitle, ekspor) untuk clipper.
- Langganan bulanan.
- Aplikasi mobile native.
- Tim dan kolaborasi multi-user dalam satu workspace.
- Generate kode bebas untuk halaman; hanya template.
- Marketplace template pihak ketiga.

## Target keberhasilan awal

- 50 pengguna terdaftar dalam 30 hari pertama setelah rilis Fase 2.
- Minimal 30% pengguna baru menjalankan satu generate dalam 5 menit pertama.
- Waktu generate teks kurang dari 10 detik untuk 90% permintaan; halaman UMKM kurang dari 60 detik.
- 10 top-up pertama dalam 60 hari setelah Fase 4.
