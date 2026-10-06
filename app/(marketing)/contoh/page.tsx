import type { Metadata } from "next";
import Link from "next/link";
import { Images } from "lucide-react";
import { examplesPageCopy as copy } from "@/content/marketing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/marketing/page-header";
import { EmptyState } from "@/components/shell/empty-state";

export const metadata: Metadata = { title: copy.metaTitle };

export default function ExamplesPage() {
  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <section className="section-y">
        <div className="container-page">
          <EmptyState
            icon={<Images aria-hidden="true" />}
            title={copy.emptyTitle}
            description={copy.emptyBody}
            action={
              <Button asChild variant="outline">
                <Link href="/modul">{copy.emptyCta}</Link>
              </Button>
            }
          />
        </div>
      </section>
    </>
  );
}
