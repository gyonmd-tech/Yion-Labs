import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeCopy } from "@/content/marketing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleIcon } from "@/components/shell/module-icon";

export function LeadMagnetCard() {
  const copy = homeCopy.leadMagnet;
  return (
    <div className="flex flex-col gap-5 rounded-card border bg-accent p-6 md:flex-row md:items-center md:p-8">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <ModuleIcon name="file-text" className="size-6" />
      </span>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="type-h3">{copy.title}</h3>
          <Badge>{copy.badge}</Badge>
        </div>
        <p className="text-muted-foreground">{copy.body}</p>
      </div>
      <Button asChild variant="outline" className="bg-background">
        <Link href="/modul/prd">
          {copy.cta}
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
