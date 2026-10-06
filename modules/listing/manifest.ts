import type { ModuleManifest } from "@/lib/modules/types";

export const manifest = {
  id: "M3",
  slug: "listing",
  name: "Listing Optimizer",
  tagline: "Judul, deskripsi, dan keyword siap tempel per marketplace.",
  description:
    "Masukkan nama dan fitur produk. Listing Optimizer menulis judul, deskripsi, dan keyword yang mengikuti batas karakter Shopee, Tokopedia, dan TikTok Shop.",
  icon: "tag",
  status: "soon",
  cost: { kind: "credits", startingFrom: 3 },
  costDetails: ["3 kredit per hasil"],
  inputs: ["Nama produk", "Fitur produk", "Platform"],
  outputs: ["Judul", "Deskripsi", "Keyword per platform"],
} as const satisfies ModuleManifest;
