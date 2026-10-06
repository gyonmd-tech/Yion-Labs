import type { ModuleManifest } from "@/lib/modules/types";

export const manifest = {
  id: "M2",
  slug: "halaman",
  name: "Halaman UMKM",
  tagline: "Landing page jualan dari form singkat, siap publish.",
  description:
    "Isi brief singkat seperti chat WhatsApp. Halaman UMKM menyusun landing page dari template dengan tombol order WhatsApp. Preview gratis, bayar saat publish.",
  icon: "layout",
  status: "soon",
  cost: { kind: "credits", startingFrom: 100 },
  costDetails: ["Preview gratis", "Publish: 100 kredit"],
  inputs: ["Brief usaha (maksimal 8 isian)", "Nomor WhatsApp"],
  outputs: ["Landing page dari template", "URL publik atau file HTML"],
} as const satisfies ModuleManifest;
