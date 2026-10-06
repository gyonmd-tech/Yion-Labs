# Video promo Labs (Remotion)

Video promo 30 detik, 1920x1080 (16:9), 30 fps. Proyek ini terpisah dari aplikasi Next.js: punya `package.json`, lockfile, dan `tsconfig` sendiri.

## Isi video

| Detik | Adegan | File |
| --- | --- | --- |
| 0-3 | Logo dan tagline | `src/scenes/Intro.tsx` |
| 3-7 | Masalah dan jawaban Labs | `src/scenes/Problem.tsx` |
| 7-14 | Portal: 5 modul dan saldo kredit | `src/scenes/Portal.tsx` |
| 14-23 | Demo PRD Mini (berlabel "Ilustrasi") | `src/scenes/Demo.tsx` |
| 23-27 | Cara kerja, 3 langkah | `src/scenes/Steps.tsx` |
| 27-30 | Ajakan: 10 kredit gratis | `src/scenes/Cta.tsx` |

Durasi tiap adegan diatur di `src/LabsPromo.tsx`. Warna dan font mengikuti `docs/design-system.md` (`src/theme.ts`). Data modul (nama, status, biaya) ada di `src/data.ts` dan perlu disamakan manual bila manifest modul di aplikasi berubah.

Video sengaja tidak memuat angka pengguna, testimoni, atau URL, dan belum memakai musik. Tambahkan audio hanya dari sumber yang lisensinya jelas.

## Menjalankan

```bash
cd video
pnpm install --ignore-workspace   # lockfile sendiri, terpisah dari aplikasi
pnpm studio                       # pratinjau di browser, bisa di-scrub per frame
pnpm render                       # hasil: out/labs-promo.mp4
pnpm still                        # satu frame: out/labs-promo.png
```

Remotion mengunduh Chrome Headless Shell sendiri saat render pertama. Untuk memakai Chromium yang sudah terpasang, isi `REMOTION_BROWSER_EXECUTABLE` dengan path-nya.

Font (Inter, Plus Jakarta Sans) di-host di `public/fonts` dengan lisensi SIL OFL, sehingga render tidak bergantung pada Google Fonts.

## Lisensi Remotion

Remotion gratis untuk individu dan perusahaan dengan maksimal 3 karyawan. Di atas itu dibutuhkan Company License dari remotion.dev. Periksa ketentuan terbaru di https://www.remotion.dev/license sebelum dipakai untuk komersial.
