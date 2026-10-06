import { brand } from "@/config/brand";

export const navCopy = {
  modulesLabel: "Modul",
  allModules: "Lihat semua modul",
  links: [
    { href: "/harga", label: "Harga" },
    { href: "/contoh", label: "Contoh" },
    { href: "/faq", label: "Bantuan" },
  ],
  signIn: "Masuk",
  getStarted: "Mulai Gratis",
  openMenu: "Buka menu",
  menuTitle: "Menu",
  home: `${brand.name}, ke beranda`,
} as const;

export const footerCopy = {
  columns: [
    { title: "Modul", links: "modules" },
    {
      title: "Sumber Daya",
      links: [
        { href: "/contoh", label: "Contoh hasil" },
        { href: "/modul/prd", label: "PRD Mini gratis" },
        { href: "/faq", label: "FAQ" },
      ],
    },
    {
      title: "Perusahaan",
      links: [
        { href: "/harga", label: "Harga" },
        { href: "/kontak", label: "Kontak" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/syarat", label: "Syarat Layanan" },
        { href: "/privasi", label: "Kebijakan Privasi" },
      ],
    },
  ],
  bottom: `© ${new Date().getFullYear()} ${brand.name}. Dibuat untuk UMKM dan kreator Indonesia.`,
} as const;
