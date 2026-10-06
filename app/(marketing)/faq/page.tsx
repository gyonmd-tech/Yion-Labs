import type { Metadata } from "next";
import Link from "next/link";
import { faqItems, faqPageCopy as copy } from "@/content/marketing";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/marketing/faq-list";
import { PageHeader } from "@/components/marketing/page-header";

export const metadata: Metadata = { title: copy.metaTitle };

export default function FaqPage() {
  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <section className="section-y">
        <div className="container-page">
          <div className="flex max-w-3xl flex-col gap-8">
            <FaqList items={faqItems} />
            <div>
              <Button asChild variant="outline">
                <Link href="/kontak">{copy.contactCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
