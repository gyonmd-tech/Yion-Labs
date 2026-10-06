/**
 * Identitas merek. "Labs" masih nama kerja; ganti di sini saja.
 */
export const brand = {
  name: "Labs",
  tagline: "Alat AI untuk UMKM dan kreator, bayar per hasil.",
  description:
    "Labs adalah kumpulan alat AI berbahasa Indonesia untuk UMKM dan content creator. Pakai kredit, bayar hanya untuk hasil yang kamu ambil.",
  locale: "id-ID",
  signupBonusCredits: 10,
  announcement: {
    text: "10 kredit gratis untuk pengguna baru",
    href: "/daftar",
  },
  /** Kontak resmi belum ditentukan pemilik; isi sebelum rilis. */
  contactEmail: null as string | null,
} as const;
