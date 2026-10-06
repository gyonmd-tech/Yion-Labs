import type { PrdOutput } from "@/modules/prd/schema";

/** Keluaran tiruan untuk AI_TEXT_PROVIDER=mock. Ditandai jelas sebagai tiruan. */
export function prdMockOutput(): PrdOutput {
  return {
    productName: "[TIRUAN] Katalog Pesanan Kue",
    oneLiner:
      "[Data tiruan dari provider mock] Pelanggan memesan kue lewat katalog sederhana dan pesanan masuk rapi ke WhatsApp penjual.",
    problem:
      "Penjual kue rumahan menerima pesanan lewat chat yang tercecer, sehingga sering salah catat jumlah, tanggal ambil, dan pembayaran.",
    targetUsers: [
      "Penjual kue rumahan dengan 10-50 pesanan per minggu",
      "Pelanggan yang memesan untuk acara keluarga",
    ],
    goals: ["Mengurangi salah catat pesanan", "Mempercepat konfirmasi pesanan ke pelanggan"],
    features: [
      {
        name: "Katalog produk",
        description: "Daftar kue dengan foto, harga, dan varian ukuran.",
        priority: "wajib",
      },
      {
        name: "Form pesanan",
        description:
          "Pelanggan memilih produk, tanggal ambil, lalu pesanan dikirim ke WhatsApp penjual.",
        priority: "wajib",
      },
      {
        name: "Rekap pesanan harian",
        description: "Penjual melihat daftar pesanan per tanggal ambil.",
        priority: "sebaiknya",
      },
      {
        name: "Pembayaran online",
        description: "Pembayaran lewat QRIS langsung dari halaman pesanan.",
        priority: "nanti",
      },
    ],
    mvpScope: {
      include: ["Katalog satu toko", "Form pesanan ke WhatsApp", "Rekap pesanan sederhana"],
      exclude: ["Pembayaran online", "Multi-cabang", "Aplikasi mobile"],
    },
    successMetrics: [
      "Salah catat pesanan turun 50% dalam 1 bulan",
      "Waktu konfirmasi pesanan di bawah 10 menit",
    ],
    risks: [
      "Asumsi: penjual sudah memakai WhatsApp Business",
      "Pelanggan lebih nyaman chat langsung daripada mengisi form",
    ],
  };
}
