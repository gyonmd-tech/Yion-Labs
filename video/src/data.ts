// Salinan ringkas dari modules/*/manifest.ts dan content/ di aplikasi.
// Perbarui di sini bila status atau biaya modul berubah.
export type IconName = "image" | "layout" | "tag" | "scissors" | "file-text";

export const brand = {
  name: "Labs",
  tagline: "Alat AI untuk UMKM dan kreator, bayar per hasil.",
  signupBonus: 10,
} as const;

export const modules: { name: string; tagline: string; cost: string; status: "Aktif" | "Segera"; icon: IconName }[] = [
  { name: "Konten Studio", tagline: "Prompt dan gambar foto produk", cost: "Mulai 1 kredit", status: "Segera", icon: "image" },
  { name: "Halaman UMKM", tagline: "Landing page jualan siap publish", cost: "Mulai 100 kredit", status: "Segera", icon: "layout" },
  { name: "Listing Optimizer", tagline: "Judul dan deskripsi per marketplace", cost: "Mulai 3 kredit", status: "Segera", icon: "tag" },
  { name: "Clip Finder", tagline: "Momen terbaik dari transkrip video", cost: "Mulai 5 kredit", status: "Segera", icon: "scissors" },
  { name: "PRD Mini", tagline: "Ide produk jadi dokumen satu halaman", cost: "Gratis · 3 per hari", status: "Aktif", icon: "file-text" },
];

// Contoh PRD untuk adegan demo. Ditampilkan dengan label "Ilustrasi".
export const demo = {
  idea: "Aplikasi katalog untuk penjual kue rumahan. Pelanggan memilih kue dan tanggal ambil, lalu pesanan masuk ke WhatsApp penjual.",
  productName: "Katalog Pesanan Kue",
  oneLiner: "Pelanggan memesan lewat katalog sederhana, pesanan masuk rapi ke WhatsApp penjual.",
  features: [
    { name: "Katalog produk", priority: "Wajib" },
    { name: "Form pesanan ke WhatsApp", priority: "Wajib" },
    { name: "Rekap pesanan harian", priority: "Sebaiknya" },
    { name: "Pembayaran online", priority: "Nanti" },
  ],
  mvp: ["Katalog satu toko", "Form pesanan", "Rekap sederhana"],
} as const;
