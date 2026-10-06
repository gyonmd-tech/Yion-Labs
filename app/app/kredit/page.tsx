import type { Metadata } from "next";
import { ReceiptText } from "lucide-react";
import { appCopy } from "@/content/app";
import { formatCredits, formatDateTime } from "@/content/common";
import { requireProfile } from "@/lib/auth/current-profile";
import { ensureBonusAndGetBalance, listMyLedger } from "@/lib/credits";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shell/empty-state";

export const metadata: Metadata = { title: appCopy.credits.metaTitle };

export default async function CreditsPage() {
  const copy = appCopy.credits;
  const profile = await requireProfile();
  const [balance, entries] = await Promise.all([
    ensureBonusAndGetBalance(profile.id),
    listMyLedger(100),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="type-h3">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-2 rounded-card border bg-accent p-6">
          <p className="text-sm font-medium text-muted-foreground">{copy.balanceLabel}</p>
          <p className="font-heading text-4xl font-extrabold text-primary">
            {formatCredits(balance)}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-card border p-6">
          <h2 className="font-heading text-lg font-bold">{copy.topUpTitle}</h2>
          <p className="text-sm text-muted-foreground">{copy.topUpBody}</p>
          <Button disabled title={appCopy.topUpSoon}>
            {appCopy.topUp}
          </Button>
        </div>
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="judul-riwayat">
        <h2 id="judul-riwayat" className="font-heading text-lg font-bold">
          {copy.historyTitle}
        </h2>
        {entries.length === 0 ? (
          <EmptyState
            icon={<ReceiptText aria-hidden="true" />}
            title={copy.emptyTitle}
            description={copy.emptyBody}
          />
        ) : (
          <div className="overflow-hidden rounded-card border bg-background">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-subtle text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    {copy.columns.date}
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    {copy.columns.description}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    {copy.columns.amount}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDateTime(e.created_at)}
                    </td>
                    <td className="px-4 py-3">{copy.reasons[e.reason]}</td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right font-semibold tabular-nums",
                        e.delta > 0 ? "text-success" : "text-foreground",
                      )}
                    >
                      {e.delta > 0 ? "+" : "−"}
                      {Math.abs(e.delta).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
