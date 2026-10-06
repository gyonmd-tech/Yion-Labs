import Link from "next/link";
import { modules } from "@/config/modules";
import { pricingPageCopy } from "@/content/marketing";
import { ModuleStatusBadge } from "@/components/shell/module-status-badge";

export function ModuleCostTable() {
  return (
    <div className="overflow-hidden rounded-card border bg-background">
      <table className="w-full text-left">
        <thead className="bg-bg-subtle text-sm text-muted-foreground">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">
              {pricingPageCopy.tableModule}
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              {pricingPageCopy.tableCost}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {modules.map((m) => (
            <tr key={m.slug} className="align-top">
              <td className="px-5 py-4">
                <div className="flex flex-col items-start gap-1.5">
                  <Link href={`/modul/${m.slug}`} className="font-medium hover:text-primary">
                    {m.name}
                  </Link>
                  <ModuleStatusBadge status={m.status} />
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-muted-foreground">
                <ul className="flex flex-col gap-1">
                  {m.costDetails.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
