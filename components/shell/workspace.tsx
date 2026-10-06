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
export function Workspace({
  header,
  input,
  result,
}: {
  header: React.ReactNode;
  input: React.ReactNode;
  result: React.ReactNode;
}) {
  const w = appCopy.workspace;
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-4 py-5 md:px-6">{header}</div>

      {/* Mobile: tab */}
      <Tabs defaultValue="input" className="flex-1 gap-4 p-4 md:hidden">
        <TabsList className="w-full">
          <TabsTrigger value="input">{w.inputTab}</TabsTrigger>
          <TabsTrigger value="result">{w.resultTab}</TabsTrigger>
        </TabsList>
        <TabsContent value="input">{input}</TabsContent>
        <TabsContent value="result">{result}</TabsContent>
      </Tabs>

      {/* Tablet dan desktop: dua panel */}
      <div className="hidden flex-1 md:grid md:grid-cols-2">
        <div className="border-r p-6">
          <Panel title={w.inputTitle}>{input}</Panel>
        </div>
        <div className="bg-bg-subtle p-6">
          <Panel title={w.resultTitle}>{result}</Panel>
        </div>
      </div>
    </div>
  );
}
