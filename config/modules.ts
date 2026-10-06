import type { ModuleManifest, ModuleSlug } from "@/lib/modules/types";
import { manifest as halaman } from "@/modules/halaman/manifest";
import { manifest as klip } from "@/modules/klip/manifest";
import { manifest as konten } from "@/modules/konten/manifest";
import { manifest as listing } from "@/modules/listing/manifest";
import { manifest as prd } from "@/modules/prd/manifest";

/**
 * Daftar modul (urutan M1 sampai M5). Portal, sidebar, menu, dan halaman
 * marketing membaca daftar ini; menambah modul cukup menambah satu entri.
 */
export const modules: readonly ModuleManifest[] = [konten, halaman, listing, klip, prd];

export function getModule(slug: string): ModuleManifest | undefined {
  return modules.find((m) => m.slug === slug);
}

export function isModuleSlug(slug: string): slug is ModuleSlug {
  return modules.some((m) => m.slug === slug);
}
