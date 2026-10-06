import type { ModuleManifest } from "@/lib/modules/types";

export const manifest = {
  id: "M5",
  slug: "prd",
  name: "PRD Mini",
  tagline: "Ubah ide produk jadi dokumen satu halaman.",
  description:
    "Tulis ide produkmu dalam satu paragraf. PRD Mini menyusun dokumen kebutuhan produk satu halaman beserta potongan scope MVP.",
  icon: "file-text",
  status: "active",
  cost: { kind: "free", dailyLimit: 3 },
  costDetails: ["Gratis, maksimal 3 per hari"],
  inputs: ["Ide produk satu paragraf"],
  outputs: ["PRD satu halaman", "Potongan scope MVP"],
} as const satisfies ModuleManifest;
