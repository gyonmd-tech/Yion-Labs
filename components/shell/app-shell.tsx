import { modules } from "@/config/modules";
import { navCopy } from "@/content/site";
import { AccountMenu } from "@/components/shell/account-menu";
import { AppBreadcrumb } from "@/components/shell/app-breadcrumb";
import { AppNav, type NavModule } from "@/components/shell/app-nav";
import { CreditPill } from "@/components/shell/credit-pill";
import { Logo } from "@/components/shell/logo";
import { MobileAppNav } from "@/components/shell/mobile-app-nav";

const navModules: NavModule[] = modules.map(({ slug, name, icon }) => ({ slug, name, icon }));

/**
 * Kerangka aplikasi: sidebar 240 px (ikon saja di 768-1023 px, drawer di
 * mobile) dan topbar 56 px berisi breadcrumb, saldo kredit, dan avatar.
 */
export function AppShell({
  user,
  balance,
  children,
}: {
  user: { name: string; email: string };
  balance: number | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-16 shrink-0 flex-col border-r bg-background md:flex lg:w-sidebar">
        <div className="flex h-topbar items-center justify-center border-b px-4 lg:justify-start">
          <Logo
            href="/app"
            label={navCopy.home}
            className="[&>span:last-child]:hidden lg:[&>span:last-child]:inline"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 lg:p-3">
          <div className="lg:hidden">
            <AppNav modules={navModules} compact />
          </div>
          <div className="hidden lg:block">
            <AppNav modules={navModules} />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-topbar items-center gap-2 border-b bg-background/95 px-2 backdrop-blur md:px-6">
          <MobileAppNav modules={navModules} />
          <div className="min-w-0 flex-1">
            <AppBreadcrumb modules={navModules} />
          </div>
          <CreditPill balance={balance} href="/app/kredit" />
          <AccountMenu name={user.name} email={user.email} />
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
