import type { Metadata } from "next";
import Link from "next/link";
import { pricingPageCopy as copy } from "@/content/marketing";
import { Button } from "@/components/ui/button";
import { ModuleCostTable } from "@/components/marketing/module-cost-table";
import { PageHeader } from "@/components/marketing/page-header";
import { RichText } from "@/components/marketing/rich-text";
import { navCopy } from "@/content/site";

export const metadata: Metadata = { title: copy.metaTitle };

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={<RichText text={copy.description} />}
      />
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ModuleCostTable />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 rounded-card border bg-bg-subtle p-6">
              <h2 className="font-heading text-lg font-bold">{copy.topupTitle}</h2>
              <p className="text-muted-foreground">{copy.topupBody}</p>
              <Button asChild className="mt-2 self-start">
                <Link href="/daftar">{navCopy.getStarted}</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-3 rounded-card border p-6">
              <h2 className="font-heading text-lg font-bold">{copy.notesTitle}</h2>
              <ul className="flex list-disc flex-col gap-2 pl-5 text-muted-foreground">
                {copy.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
