"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { appCopy } from "@/content/app";
import { navCopy } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AppNav, type NavModule } from "@/components/shell/app-nav";
import { Logo } from "@/components/shell/logo";

export function MobileAppNav({ modules }: { modules: readonly NavModule[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={appCopy.nav.openMenu}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 max-w-[85vw]">
        <SheetHeader>
          <SheetTitle className="sr-only">{appCopy.nav.menuTitle}</SheetTitle>
          <Logo href="/app" label={navCopy.home} />
        </SheetHeader>
        <div className="px-3">
          <AppNav modules={modules} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
