export const MODULE_SLUGS = ["konten", "listing", "klip", "halaman", "prd"] as const;

export type ModuleSlug = (typeof MODULE_SLUGS)[number];

/** Aktif = bisa dipakai, Beta = bisa dipakai dengan catatan, Segera = belum bisa diklik. */
export type ModuleStatus = "active" | "beta" | "soon";

/** Nama ikon dari lucide-react; dipetakan ke komponen di components/shell/module-icon.tsx. */
export type ModuleIconName = "image" | "tag" | "scissors" | "layout" | "file-text";

export type ModuleCost =
  { kind: "free"; dailyLimit: number } | { kind: "credits"; startingFrom: number };

export type ModuleManifest = {
  /** ID di PRD, mis. "M1". */
  id: string;
  slug: ModuleSlug;
  name: string;
  /** Satu baris fungsi untuk kartu dan menu. */
  tagline: string;
  description: string;
  icon: ModuleIconName;
  status: ModuleStatus;
  cost: ModuleCost;
  /** Rincian biaya yang tampil di halaman modul dan harga. */
  costDetails: readonly string[];
  inputs: readonly string[];
  outputs: readonly string[];
};
