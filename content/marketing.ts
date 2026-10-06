import { brand } from "@/config/brand";

export const homeCopy = {
  hero: {
    title: "Foto, copy, dan halaman jualan. Selesai dalam hitungan menit.",
    description: `${brand.name} adalah kumpulan alat AI berbahasa Indonesia untuk UMKM dan kreator. **Bayar per hasil dengan kredit**, tanpa langganan.`,
    cta: "Coba gratis",
    mockupGreeting: "Halo, selamat datang",
    mockupBalance: "10 kredit",
  },
  why: {
    eyebrow: `kenapa ${brand.name.toLowerCase()}`,
    title: "Dibuat untuk cara kerja UMKM dan kreator Indonesia",
    items: [
      {
        title: "Bahasa Indonesia dari awal",
        body: "Form, hasil, dan tombol memakai **bahasa Indonesia sehari-hari**. Tidak perlu menerjemahkan prompt berbahasa Inggris.",
      },
      {
        title: "Bayar per hasil, dalam rupiah",
        body: "Isi saldo kredit saat butuh saja. **Tidak ada langganan bulanan** yang tetap jalan saat kamu sedang tidak memakai.",
      },
      {
        title: "Lihat dulu, baru bayar",
        body: "Gambar dan halaman jualan punya **preview gratis**. Kredit baru terpotong saat kamu mengunduh atau publish.",
      },
      {
        title: "Hasil konsisten dari template",
        body: "Kamu memilih dari pilihan yang terarah, bukan menulis prompt dari nol. Hasilnya **lebih mudah dinilai dalam hitungan detik**.",
      },
    ],
    examplePlaceholder: "Contoh hasil nyata ditampilkan di sini setelah modul aktif.",
  },
  modules: {
    eyebrow: "modul",
    title: "Satu akun, satu saldo, banyak alat",
    description: "Pilih modul sesuai kebutuhan hari ini. Semua memakai saldo kredit yang sama.",
  },
  leadMagnet: {
    badge: "Gratis",
    title: "PRD Mini gratis",
    body: "Punya ide produk? Tulis satu paragraf, dapatkan dokumen kebutuhan produk satu halaman beserta potongan scope MVP. Gratis 3 kali per hari.",
    cta: "Lihat PRD Mini",
  },
  howItWorks: {
    eyebrow: "cara kerja",
    title: "Tiga langkah sampai hasil di tangan",
    steps: [
      {
        title: "Daftar dan dapat kredit",
        body: `Buat akun gratis dan dapatkan **${brand.signupBonusCredits} kredit** untuk mencoba.`,
      },
      {
        title: "Pilih modul, isi form",
        body: "Jawab beberapa pilihan singkat. Biaya kredit selalu terlihat **sebelum** kamu menekan tombol.",
      },
      {
        title: "Nilai hasil, ambil yang cocok",
        body: "Semua hasil tersimpan di akunmu. Salin, unduh, atau publish yang kamu suka.",
      },
    ],
  },
  examples: {
    eyebrow: "contoh hasil",
    title: "Contoh hasil",
    description:
      "Kami hanya akan menampilkan hasil nyata dari modul yang sudah aktif. Galeri ini diisi saat modul pertama dibuka.",
    cta: "Buka galeri contoh",
  },
  pricing: {
    eyebrow: "harga",
    title: "Bayar sesuai pemakaian",
    description: `Pengguna baru mendapat **${brand.signupBonusCredits} kredit gratis**. Biaya tiap modul:`,
    cta: "Lihat detail harga",
  },
  faq: {
    eyebrow: "faq",
    title: "Pertanyaan yang sering muncul",
    cta: "Lihat semua pertanyaan",
  },
  closing: {
    title: "Siap mencoba?",
    description: `Daftar gratis dan dapatkan ${brand.signupBonusCredits} kredit untuk mulai.`,
    cta: "Coba gratis",
  },
} as const;

export const modulesPageCopy = {
  metaTitle: "Modul",
  eyebrow: "modul",
  title: "Semua modul",
  description:
    "Setiap modul punya form, hasil, dan biaya kreditnya sendiri. Modul berstatus Segera sedang disiapkan.",
} as const;

export const moduleDetailCopy = {
  back: "Semua modul",
  inputsTitle: "Yang kamu isi",
  outputsTitle: "Yang kamu dapat",
  costTitle: "Biaya",
  examplesTitle: "Contoh hasil",
  examplesPlaceholder:
    "Contoh hasil nyata dari modul ini akan ditampilkan setelah modul aktif. Kami tidak memakai contoh rekaan.",
  ctaActive: "Coba gratis",
  ctaSoon: "Daftar sekarang",
  soonNote:
    "Modul ini belum bisa dipakai. Daftar sekarang untuk menyimpan bonus kredit pendaftaran.",
} as const;

export const pricingPageCopy = {
  metaTitle: "Harga",
  eyebrow: "harga",
  title: "Harga per hasil, tanpa langganan",
  description: `Labs memakai **kredit prabayar**. Saldo hanya terpotong saat kamu mengambil hasil, dan pengguna baru mendapat **${brand.signupBonusCredits} kredit gratis**.`,
  tableModule: "Modul",
  tableCost: "Biaya",
  topupTitle: "Paket top-up",
  topupBody:
    "Pembayaran lewat QRIS, virtual account, dan e-wallet sedang disiapkan. Paket top-up dalam rupiah akan diumumkan di halaman ini saat pembayaran dibuka.",
  notesTitle: "Catatan",
  notes: [
    "Preview gambar dan halaman gratis, dengan batas harian.",
    "Jika proses gagal setelah kredit terpotong, kredit dikembalikan otomatis.",
    "Biaya bisa berubah sebelum rilis; perubahan diumumkan di halaman ini.",
  ],
} as const;

export const examplesPageCopy = {
  metaTitle: "Contoh",
  eyebrow: "contoh",
  title: "Galeri contoh hasil",
  description: "Kami hanya menampilkan hasil nyata dari modul yang sudah aktif.",
  emptyTitle: "Belum ada contoh",
  emptyBody:
    "Galeri ini diisi saat modul pertama dibuka. Sambil menunggu, lihat penjelasan tiap modul.",
  emptyCta: "Lihat modul",
} as const;

export const contactPageCopy = {
  metaTitle: "Kontak",
  eyebrow: "kontak",
  title: "Hubungi kami",
  description: "Punya pertanyaan, saran, atau kendala dengan akunmu?",
  emailLabel: "Email",
  pendingTitle: "Kanal kontak sedang disiapkan",
  pendingBody:
    "Alamat email dan kanal dukungan resmi akan dicantumkan di sini sebelum rilis. Sementara itu, lihat halaman FAQ.",
  faqCta: "Buka FAQ",
} as const;

export const faqPageCopy = {
  metaTitle: "FAQ",
  eyebrow: "bantuan",
  title: "Pertanyaan yang sering muncul",
  description: "Tidak menemukan jawabannya? Hubungi kami lewat halaman Kontak.",
  contactCta: "Ke halaman Kontak",
} as const;

export const faqItems = [
  {
    q: `Apa itu ${brand.name}?`,
    a: `${brand.name} adalah kumpulan alat AI berbahasa Indonesia untuk UMKM, content creator, dan freelancer: foto produk, copy marketplace, ide klip, halaman jualan, dan PRD singkat.`,
  },
  {
    q: "Apa itu kredit?",
    a: "Kredit adalah saldo yang dipakai untuk mengambil hasil. Setiap modul menampilkan biaya kreditnya sebelum kamu menekan tombol.",
  },
  {
    q: "Apakah ada langganan bulanan?",
    a: "Tidak. Kamu cukup mengisi saldo kredit saat butuh.",
  },
  {
    q: "Apakah saya bisa mencoba gratis?",
    a: `Bisa. Pengguna baru mendapat ${brand.signupBonusCredits} kredit gratis, dan PRD Mini gratis sampai 3 kali per hari.`,
  },
  {
    q: "Kapan kredit saya terpotong?",
    a: "Untuk modul teks, saat hasil dibuat. Untuk gambar dan halaman, preview gratis dan kredit baru terpotong saat kamu mengunduh atau publish.",
  },
  {
    q: "Bagaimana cara mengisi saldo?",
    a: "Top-up lewat QRIS, virtual account, dan e-wallet sedang disiapkan. Paketnya akan diumumkan di halaman Harga.",
  },
  {
    q: "Apakah semua modul sudah bisa dipakai?",
    a: "Belum. Modul dibuka bertahap. Status tiap modul (Aktif, Beta, atau Segera) terlihat di halaman Modul.",
  },
] as const;
