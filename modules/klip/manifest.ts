import type { ModuleManifest } from "@/lib/modules/types";

export const manifest = {
  id: "M4",
  slug: "klip",
  name: "Clip Finder",
  tagline: "Temukan momen terbaik video dari transkripnya.",
  description:
    "Tempel transkrip atau unggah file .srt/.vtt. Clip Finder memilih momen terbaik lengkap dengan timestamp, hook, dan caption.",
  icon: "scissors",
  status: "soon",
  cost: { kind: "credits", startingFrom: 5 },
  costDetails: ["5 kredit per hasil"],
  inputs: ["Transkrip video (teks, .srt, atau .vtt)"],
  outputs: ["Momen terbaik dengan timestamp", "Hook", "Caption"],
} as const satisfies ModuleManifest;
