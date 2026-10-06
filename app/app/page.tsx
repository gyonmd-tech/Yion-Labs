import type { Metadata } from "next";
import { History } from "lucide-react";
import { modules } from "@/config/modules";
import { appCopy } from "@/content/app";
import { requireProfile } from "@/lib/auth/current-profile";
import { ensureBonusAndGetBalance } from "@/lib/credits";
import { Button } from "@/components/ui/button";
import { CreditPill } from "@/components/shell/credit-pill";
import { EmptyState } from "@/components/shell/empty-state";
import { ModuleCard } from "@/components/shell/module-card";

export const metadata: Metadata = { title: appCopy.portalLabel };

export default async function PortalPage() {
  const profile = await requireProfile();
  const firstName = profile.name.split(" ")[0] ?? "";
  const balance = await ensureBonusAndGetBalance(profile.id);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 md:px-6 md:py-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="type-h3">{appCopy.greeting(firstName)}</h1>
          <p className="text-muted-foreground">{appCopy.portalDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <CreditPill balance={balance} className="h-11" />
          <Button disabled title={appCopy.topUpSoon}>
            {appCopy.topUp}
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="judul-modul">
        <h2 id="judul-modul" className="font-heading text-lg font-bold">
          {appCopy.modulesTitle}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m) => (
            <li key={m.slug}>
              <ModuleCard module={m} href={`/app/${m.slug}`} disabled={m.status === "soon"} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="judul-lanjutkan">
        <h2 id="judul-lanjutkan" className="font-heading text-lg font-bold">
          {appCopy.continueTitle}
        </h2>
        <EmptyState
          icon={<History aria-hidden="true" />}
          title={appCopy.continueEmptyTitle}
          description={appCopy.continueEmptyBody}
        />
      </section>
    </div>
  );
}
