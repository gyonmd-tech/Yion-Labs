import { navCopy } from "@/content/site";
import { Logo } from "@/components/shell/logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-bg-subtle">
      <header className="container-page flex h-16 items-center">
        <Logo label={navCopy.home} />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 md:items-center">
        <div className="w-full max-w-md rounded-card border bg-background p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
