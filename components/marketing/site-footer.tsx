import Link from "next/link";
import { brand } from "@/config/brand";
import { modules } from "@/config/modules";
import { footerCopy, navCopy } from "@/content/site";
import { Logo } from "@/components/shell/logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-bg-subtle">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <Logo label={navCopy.home} />
          <p className="max-w-xs text-sm text-muted-foreground">{brand.tagline}</p>
        </div>
        {footerCopy.columns.map((col) => {
          const links =
            col.links === "modules"
              ? modules.map((m) => ({ href: `/modul/${m.slug}`, label: m.name }))
              : col.links;
          return (
            <div key={col.title}>
              <h2 className="text-sm font-semibold">{col.title}</h2>
              <ul className="mt-3 flex flex-col">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground md:min-h-9"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="border-t">
        <p className="container-page py-6 text-sm text-muted-foreground">{footerCopy.bottom}</p>
      </div>
    </footer>
  );
}
