/** Batas pemakaian di server. Ubah di sini saja. */
export const limits = {
  /** Rate limit gabungan semua endpoint /api/ai per pengguna. */
  aiRequests: { bucket: "ai", windowSeconds: 60, max: 10 },
  /** Zona waktu untuk menghitung "hari" pada batas harian. */
  timeZone: "Asia/Jakarta",
} as const;
