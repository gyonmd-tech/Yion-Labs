import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth/current-profile";
import { getDailyRemaining } from "@/lib/usage";
import { ModuleHeader } from "@/components/shell/module-header";
import { manifest } from "@/modules/prd/manifest";
import { PrdWorkspace } from "@/modules/prd/ui/prd-workspace";

export const metadata: Metadata = { title: manifest.name };

export default async function PrdPage() {
  const profile = await requireProfile();
  const dailyLimit = manifest.cost.dailyLimit;
  const remaining = await getDailyRemaining(profile.id, manifest.slug, dailyLimit);

  return (
    <PrdWorkspace
      header={<ModuleHeader module={manifest} />}
      dailyLimit={dailyLimit}
      initialRemaining={remaining}
    />
  );
}
