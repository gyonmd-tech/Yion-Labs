import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand } from "@/config/brand";

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container-page flex min-h-10 items-center justify-center text-center text-sm">
        <Link
          href={brand.announcement.href}
          className="inline-flex min-h-10 items-center gap-1.5 font-medium underline-offset-4 hover:underline"
        >
          {brand.announcement.text}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
