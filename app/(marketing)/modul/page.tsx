import type { Metadata } from "next";
import { modules } from "@/config/modules";
import { modulesPageCopy } from "@/content/marketing";
import { LeadMagnetCard } from "@/components/marketing/lead-magnet-card";
import { PageHeader } from "@/components/marketing/page-header";
import { ModuleCard } from "@/components/shell/module-card";

export const metadata: Metadata = { title: modulesPageCopy.metaTitle };

export default function ModulesPage() {
  return (
    <>
      <PageHeader
        eyebrow={modulesPageCopy.eyebrow}
        title={modulesPageCopy.title}
        description={modulesPageCopy.description}
      />
      <section className="section-y">
        <div className="container-page flex flex-col gap-10">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <li key={m.slug}>
                <ModuleCard
                  module={m}
                  href={`/modul/${m.slug}`}
                  index={String(i + 1).padStart(2, "0")}
                />
              </li>
            ))}
          </ul>
          <LeadMagnetCard />
        </div>
      </section>
    </>
  );
}
