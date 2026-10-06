/** Pesan galat endpoint yang ditampilkan ke pengguna. */
export const apiErrorCopy = {
  unauthorized: "Sesi kamu sudah berakhir. Silakan masuk lagi.",
  invalid_input: "Periksa lagi isian kamu.",
  module_unavailable: "Modul ini belum bisa dipakai.",
  rate_limited: "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.",
  daily_limit: "Kuota harian modul ini sudah habis. Coba lagi besok.",
  insufficient_credits: "Saldo kredit kamu tidak cukup.",
  ai_failed: "Hasil belum berhasil dibuat. Kredit kamu tidak terpotong. Coba lagi.",
  ai_refused: "Permintaan ini tidak bisa diproses. Coba ubah isian kamu.",
  server_error: "Terjadi kesalahan di server. Coba lagi sebentar lagi.",
} as const;

export type ApiErrorCode = keyof typeof apiErrorCopy;
