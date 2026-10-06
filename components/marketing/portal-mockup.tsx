import { modules } from "@/config/modules";
import { homeCopy } from "@/content/marketing";
import { formatModuleCost } from "@/content/common";
import { ModuleIcon } from "@/components/shell/module-icon";

/** Ilustrasi dekoratif portal; disembunyikan dari pembaca layar. */
export function PortalMockup() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-5xl overflow-hidden rounded-card border bg-background shadow-2xl shadow-primary/10"
    >
      <div className="flex h-10 items-center gap-1.5 border-b bg-bg-subtle px-4">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
      </div>
      <div className="flex">
        <div className="hidden w-48 shrink-0 flex-col gap-2 border-r p-4 md:flex">
          {modules.map((m) => (
            <div key={m.slug} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs">
              <ModuleIcon name={m.icon} className="size-4 text-primary" />
              <span className="truncate">{m.name}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-heading text-sm font-bold">{homeCopy.hero.mockupGreeting}</span>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
              {homeCopy.hero.mockupBalance}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {modules.map((m) => (
              <div key={m.slug} className="flex flex-col gap-2 rounded-lg border p-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-accent text-primary">
                  <ModuleIcon name={m.icon} className="size-4" />
                </span>
                <span className="text-xs font-semibold">{m.name}</span>
                <span className="text-xs text-muted-foreground">{formatModuleCost(m.cost)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
