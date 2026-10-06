import Link from "next/link";
import { Menu } from "lucide-react";
import { modules } from "@/config/modules";
import { navCopy } from "@/content/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModuleIcon } from "@/components/shell/module-icon";

const itemClass =
  "flex min-h-11 items-center gap-3 rounded-md px-3 text-base hover:bg-accent focus-visible:bg-accent";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={navCopy.openMenu}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{navCopy.menuTitle}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6">
          <p className="px-3 pt-2 pb-1 text-sm font-medium text-muted-foreground">
            {navCopy.modulesLabel}
          </p>
          {modules.map((m) => (
            <SheetClose asChild key={m.slug}>
              <Link href={`/modul/${m.slug}`} className={itemClass}>
                <ModuleIcon name={m.icon} className="size-5 text-primary" />
                {m.name}
              </Link>
            </SheetClose>
          ))}
          <div className="my-2 border-t" />
          {navCopy.links.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link href={link.href} className={itemClass}>
                {link.label}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link href="/masuk" className={itemClass}>
              {navCopy.signIn}
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
