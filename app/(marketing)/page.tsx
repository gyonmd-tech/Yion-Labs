import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { modules } from "@/config/modules";
import { faqItems, homeCopy } from "@/content/marketing";
import { formatModuleCost } from "@/content/common";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/marketing/faq-list";
import { LeadMagnetCard } from "@/components/marketing/lead-magnet-card";
import { PortalMockup } from "@/components/marketing/portal-mockup";
import { RichText } from "@/components/marketing/rich-text";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ModuleCard } from "@/components/shell/module-card";

const pad = (n: number) => String(n).padStart(2, "0");

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="container-page flex flex-col items-center gap-6 pt-14 text-center md:pt-24">
          <h1 className="max-w-3xl type-h1">{homeCopy.hero.title}</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            <RichText text={homeCopy.hero.description} />
          </p>
          <Button asChild size="lg">
            <Link href="/daftar">
              {homeCopy.hero.cta}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="container-page pt-12 pb-14 md:pt-16 md:pb-24">
          <PortalMockup />
        </div>
      </section>

      {/* Angka hasil: sengaja dikosongkan sampai ada data nyata. */}

      {/* Kenapa Labs */}
      <section className="bg-bg-subtle section-y">
        <div className="container-page flex flex-col gap-12">
          <SectionHeading eyebrow={homeCopy.why.eyebrow} title={homeCopy.why.title} />
          <ol className="grid gap-6 md:grid-cols-2">
            {homeCopy.why.items.map((item, i) => (
              <li
                key={item.title}
                className="flex flex-col gap-4 rounded-card border bg-background p-6"
              >
                <span className="font-heading text-3xl font-extrabold text-primary">
                  {pad(i + 1)}
                </span>
                <h3 className="type-h3">{item.title}</h3>
                <p className="text-muted-foreground">
                  <RichText text={item.body} />
                </p>
                <div className="mt-auto rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  {homeCopy.why.examplePlaceholder}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Grid modul */}
      <section className="section-y">
        <div className="container-page flex flex-col gap-10">
          <SectionHeading
            eyebrow={homeCopy.modules.eyebrow}
            title={homeCopy.modules.title}
            description={homeCopy.modules.description}
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <li key={m.slug}>
                <ModuleCard module={m} href={`/modul/${m.slug}`} index={pad(i + 1)} />
              </li>
            ))}
          </ul>
          <LeadMagnetCard />
        </div>
      </section>

      {/* Cara kerja */}
      <section className="bg-bg-subtle section-y">
        <div className="container-page flex flex-col gap-10">
          <SectionHeading eyebrow={homeCopy.howItWorks.eyebrow} title={homeCopy.howItWorks.title} />
          <ol className="grid gap-6 md:grid-cols-3">
            {homeCopy.howItWorks.steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="type-h3">{step.title}</h3>
                <p className="text-muted-foreground">
                  <RichText text={step.body} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contoh hasil */}
      <section className="section-y">
        <div className="container-page flex flex-col gap-8">
          <SectionHeading
            eyebrow={homeCopy.examples.eyebrow}
            title={homeCopy.examples.title}
            description={homeCopy.examples.description}
          />
          <div>
            <Button asChild variant="outline">
              <Link href="/contoh">{homeCopy.examples.cta}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Harga ringkas */}
      <section className="bg-bg-subtle section-y">
        <div className="container-page flex flex-col gap-10">
          <SectionHeading
            eyebrow={homeCopy.pricing.eyebrow}
            title={homeCopy.pricing.title}
            description={<RichText text={homeCopy.pricing.description} />}
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {modules.map((m) => (
              <li
                key={m.slug}
                className="flex flex-col gap-1 rounded-card border bg-background p-5"
              >
                <span className="font-medium">{m.name}</span>
                <span className="text-sm text-primary">{formatModuleCost(m.cost)}</span>
              </li>
            ))}
          </ul>
          <div>
            <Button asChild variant="outline" className="bg-background">
              <Link href="/harga">{homeCopy.pricing.cta}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="flex flex-col items-start gap-6">
            <SectionHeading eyebrow={homeCopy.faq.eyebrow} title={homeCopy.faq.title} />
            <Button asChild variant="outline">
              <Link href="/faq">{homeCopy.faq.cta}</Link>
            </Button>
          </div>
          <FaqList items={faqItems.slice(0, 5)} />
        </div>
      </section>

      {/* CTA penutup */}
      <section className="bg-primary section-y text-primary-foreground">
        <div className="container-page flex flex-col items-center gap-5 text-center">
          <h2 className="type-h2">{homeCopy.closing.title}</h2>
          <p className="max-w-lg text-primary-foreground/85">{homeCopy.closing.description}</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/daftar">{homeCopy.closing.cta}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
