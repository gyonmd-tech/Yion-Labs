import Link from "next/link";
import { modules } from "@/config/modules";
import { navCopy } from "@/content/site";
import { moduleStatusLabel } from "@/content/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Logo } from "@/components/shell/logo";
import { ModuleIcon } from "@/components/shell/module-icon";
import { MobileNav } from "@/components/marketing/mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo label={navCopy.home} />

        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11">{navCopy.modulesLabel}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[640px] grid-cols-2 gap-1 p-2">
                  {modules.map((m) => (
                    <li key={m.slug}>
                      <NavigationMenuLink asChild>
                        <Link href={`/modul/${m.slug}`} className="flex-row items-start gap-3 p-3">
                          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                            <ModuleIcon name={m.icon} className="size-5" />
                          </span>
                          <span className="flex flex-col gap-1">
                            <span className="flex items-center gap-2 font-medium text-foreground">
                              {m.name}
                              {m.status !== "active" && (
                                <Badge variant="secondary">{moduleStatusLabel[m.status]}</Badge>
                              )}
                            </span>
                            <span className="text-muted-foreground">{m.tagline}</span>
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="col-span-2 border-t pt-1">
                    <NavigationMenuLink asChild>
                      <Link href="/modul" className="p-3 font-medium text-primary">
                        {navCopy.allModules}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {navCopy.links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle({ className: "h-11" })}
                >
                  <Link href={link.href}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/masuk">{navCopy.signIn}</Link>
          </Button>
          <Button asChild>
            <Link href="/daftar">{navCopy.getStarted}</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
