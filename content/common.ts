import { limits } from "@/config/limits";
import type { ModuleCost, ModuleStatus } from "@/lib/modules/types";

export const moduleStatusLabel: Record<ModuleStatus, string> = {
  active: "Aktif",
  beta: "Beta",
  soon: "Segera",
};

export function formatCredits(amount: number): string {
  return `${amount.toLocaleString("id-ID")} kredit`;
}

export function formatModuleCost(cost: ModuleCost): string {
  if (cost.kind === "free") return `Gratis · ${cost.dailyLimit} per hari`;
  return `Mulai ${formatCredits(cost.startingFrom)}`;
}

const dateTimeFormat = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: limits.timeZone,
});

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}
