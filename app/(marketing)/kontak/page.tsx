import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { brand } from "@/config/brand";
import { contactPageCopy as copy } from "@/content/marketing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/marketing/page-header";
import { EmptyState } from "@/components/shell/empty-state";

export const metadata: Metadata = { title: copy.metaTitle };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <section className="section-y">
        <div className="container-page">
          <div className="max-w-3xl">
            {brand.contactEmail ? (
              <div className="flex items-center gap-4 rounded-card border p-6">
                <Mail aria-hidden="true" className="size-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{copy.emailLabel}</p>
                  <a
                    href={`mailto:${brand.contactEmail}`}
                    className="font-medium hover:text-primary"
                  >
                    {brand.contactEmail}
                  </a>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<Mail aria-hidden="true" />}
                title={copy.pendingTitle}
                description={copy.pendingBody}
                action={
                  <Button asChild variant="outline">
                    <Link href="/faq">{copy.faqCta}</Link>
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
