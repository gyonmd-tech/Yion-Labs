import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
