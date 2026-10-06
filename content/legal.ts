import { brand } from "@/config/brand";

export type LegalDoc = {
  metaTitle: string;
  title: string;
  draftNotice: string;
  sections: readonly { heading: string; body: string }[];
};

const draftNotice =
  "Draf. Dokumen ini belum final dan belum berlaku. Versi resmi akan ditinjau dan diterbitkan sebelum rilis.";

export const termsDoc: LegalDoc = {
  metaTitle: "Syarat Layanan",
  title: "Syarat Layanan",
  draftNotice,
  sections: [
    {
      heading: "Layanan",
      body: `${brand.name} menyediakan alat berbasis AI untuk membuat konten seperti prompt, gambar, copy, dan halaman jualan.`,
    },
    {
      heading: "Akun",
      body: "Kamu bertanggung jawab menjaga keamanan akunmu dan semua aktivitas yang terjadi di dalamnya.",
    },
    {
      heading: "Kredit",
      body: "Kredit dipakai untuk mengambil hasil. Ketentuan pembelian, masa berlaku, dan pengembalian kredit akan dijelaskan di versi resmi.",
    },
    {
      heading: "Penggunaan yang dilarang",
      body: "Kamu tidak boleh memakai layanan untuk konten yang melanggar hukum, menyesatkan, meniru tokoh publik atau merek terdaftar, atau melanggar hak pihak lain.",
    },
    {
      heading: "Hasil dari AI",
      body: "Hasil dibuat otomatis dan bisa mengandung kesalahan. Periksa hasil sebelum dipakai atau dipublikasikan.",
    },
  ],
};

export const privacyDoc: LegalDoc = {
  metaTitle: "Kebijakan Privasi",
  title: "Kebijakan Privasi",
  draftNotice,
  sections: [
    {
      heading: "Data yang kami simpan",
      body: "Data akun (nama dan email), input yang kamu kirim ke modul, hasil yang dibuat, dan riwayat kredit.",
    },
    {
      heading: "Penggunaan data",
      body: "Data dipakai untuk menjalankan layanan, menyimpan hasil di akunmu, dan menghitung saldo kredit.",
    },
    {
      heading: "Penyedia pihak ketiga",
      body: "Kami memakai penyedia infrastruktur, AI, dan pembayaran untuk menjalankan layanan. Daftar penyedia akan dicantumkan di versi resmi.",
    },
    {
      heading: "Hak kamu",
      body: "Kamu bisa menghapus hasil dari akunmu. Cara meminta salinan atau penghapusan akun akan dijelaskan di versi resmi.",
    },
  ],
};
