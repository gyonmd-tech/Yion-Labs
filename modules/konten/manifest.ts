import type { ModuleManifest } from "@/lib/modules/types";

export const manifest = {
  id: "M1",
  slug: "konten",
  name: "Konten Studio",
  tagline: "Susun prompt foto produk, lalu buat gambarnya.",
  description:
    "Pilih jenis produk, gaya, dan rasio. Konten Studio menyusun prompt yang rapi dan bisa langsung membuat gambar produk dengan preview gratis.",
  icon: "image",
  status: "soon",
  cost: { kind: "credits", startingFrom: 1 },
  costDetails: [
    "Prompt: 1 kredit",
    "Gambar: 10 kredit saat diunduh (preview gratis, dibatasi per hari)",
  ],
  inputs: ["Jenis produk", "Gaya foto", "Rasio gambar"],
  outputs: ["Prompt terstruktur", "Gambar produk (opsional)"],
} as const satisfies ModuleManifest;
