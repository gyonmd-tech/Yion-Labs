import { appCopy } from "@/content/app";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="flex min-h-0 flex-col gap-4">
      <h2 className="hidden font-heading text-lg font-bold md:block">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Kerangka dua panel yang sama untuk semua modul. Desktop: input kiri,
 * hasil kanan. Mobile: tab Input | Hasil. Hanya isi panel yang berbeda.
 */
export type WorkspaceTab = "input" | "result";

export function Workspace({
  header,
  input,
  result,
  tab,
  onTabChange,
}: {
  header: React.ReactNode;
  input: React.ReactNode;
  result: React.ReactNode;
  /** Opsional: tab aktif di mobile, untuk modul yang ingin berpindah otomatis. */
  tab?: WorkspaceTab;
  onTabChange?: (tab: WorkspaceTab) => void;
}) {
  const w = appCopy.workspace;
  // Setiap panel dirender sekali. Di mobile tab menyembunyikan panel yang tidak aktif;
  // mulai md keduanya tampil berdampingan dan daftar tab disembunyikan.
  const panelClass =
    "flex-1 p-4 data-[state=inactive]:hidden md:p-6 md:data-[state=inactive]:block";
  return (
    <Tabs
      defaultValue="input"
      value={tab}
      onValueChange={onTabChange ? (value) => onTabChange(value as WorkspaceTab) : undefined}
      className="flex flex-1 flex-col gap-0"
    >
      <div className="border-b px-4 py-5 md:px-6">{header}</div>
      <div className="px-4 pt-4 md:hidden">
        <TabsList className="w-full">
          <TabsTrigger value="input">{w.inputTab}</TabsTrigger>
          <TabsTrigger value="result">{w.resultTab}</TabsTrigger>
        </TabsList>
      </div>
      <div className="flex flex-1 flex-col md:grid md:grid-cols-2">
        <TabsContent value="input" forceMount className={`${panelClass} md:border-r`}>
          <Panel title={w.inputTitle}>{input}</Panel>
        </TabsContent>
        <TabsContent value="result" forceMount className={`${panelClass} md:bg-bg-subtle`}>
          <Panel title={w.resultTitle}>{result}</Panel>
        </TabsContent>
      </div>
    </Tabs>
  );
}
