import { PRD_IDEA_MAX, PRD_IDEA_MIN } from "@/modules/prd/schema";

/** Teks UI modul PRD Mini. */
export const prdCopy = {
  form: {
    label: "Ide produk kamu",
    placeholder:
      "Contoh: Aplikasi katalog untuk penjual kue rumahan. Pelanggan memilih kue, tanggal ambil, lalu pesanan masuk ke WhatsApp penjual.",
    hint: `Tulis satu paragraf: produknya apa, untuk siapa, dan masalah apa yang diselesaikan. ${PRD_IDEA_MIN}-${PRD_IDEA_MAX} karakter.`,
    counter: (n: number) => `${n.toLocaleString("id-ID")}/${PRD_IDEA_MAX.toLocaleString("id-ID")}`,
    tooShort: `Ide terlalu pendek. Tulis minimal ${PRD_IDEA_MIN} karakter.`,
    tooLong: `Ide terlalu panjang. Maksimal ${PRD_IDEA_MAX} karakter.`,
    submit: "Buat PRD",
    submitting: "Sedang menyusun...",
    cost: "Gratis",
    remaining: (n: number, limit: number) => `Sisa ${n} dari ${limit} hari ini`,
    exhausted: "Kuota hari ini habis. Kamu bisa membuat PRD lagi besok.",
  },
  loading: {
    title: "Menyusun PRD kamu",
    eta: "Biasanya selesai dalam 10-15 detik.",
  },
  error: {
    title: "PRD belum berhasil dibuat",
    retry: "Coba lagi",
    network: "Koneksi terputus. Periksa internet kamu lalu coba lagi.",
  },
  empty: {
    title: "Belum ada PRD",
    body: "Tulis ide produkmu di kiri, lalu tekan Buat PRD. Hasilnya muncul di sini dan otomatis tersimpan di Library.",
  },
  result: {
    saved: "Tersimpan di Library",
    open: "Buka halaman hasil",
    copy: "Salin PRD",
    newOne: "Buat PRD baru",
  },
  detail: {
    back: "Kembali ke PRD Mini",
    notFound: "Hasil tidak ditemukan",
    failedTitle: "Hasil ini gagal dibuat",
    failedBody:
      "Proses AI gagal sehingga tidak ada dokumen yang tersimpan. Kredit tidak terpotong.",
  },
  sections: {
    problem: "Masalah",
    targetUsers: "Pengguna sasaran",
    goals: "Tujuan",
    features: "Fitur",
    mvpInclude: "Dikerjakan di MVP",
    mvpExclude: "Ditunda",
    mvp: "Scope MVP",
    successMetrics: "Ukuran keberhasilan",
    risks: "Risiko dan asumsi",
  },
  priority: {
    wajib: "Wajib",
    sebaiknya: "Sebaiknya",
    nanti: "Nanti",
  },
} as const;
