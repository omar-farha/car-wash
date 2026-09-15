import type { Metadata } from "next";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { FinanceRangeFilter } from "@/components/dashboard/finance/finance-range-filter";
import { ExpenseDialog } from "@/components/dashboard/finance/expense-dialog";
import { ExpenseList } from "@/components/dashboard/finance/expense-list";
import { ExportExpensesButton } from "@/components/dashboard/finance/export-expenses-button";
import { PrintButton } from "@/components/dashboard/print-button";
import { requireOwner } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";
import { getFinanceSummary, type FinanceRange } from "@/lib/data/finance";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "الماليات" };

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  await requireOwner();

  const [settings, summary] = await Promise.all([
    getSettings(),
    getFinanceSummary({
      range: (params.range as FinanceRange) ?? "today",
      from: params.from,
      to: params.to,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="الماليات"
        description="الإيرادات والمصروفات وصافي الربح"
        action={
          <div className="flex flex-wrap items-center gap-2.5 no-print">
            <ExportExpensesButton data={summary.expenses} />
            <PrintButton />
            <ExpenseDialog />
          </div>
        }
      />

      <div className="no-print">
        <FinanceRangeFilter />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label="الإيرادات"
          value={formatCurrency(summary.income, settings.currency)}
          tone="success"
        />
        <StatCard
          icon={TrendingDown}
          label="المصروفات"
          value={formatCurrency(summary.expensesTotal, settings.currency)}
          tone="warning"
        />
        <StatCard
          icon={Wallet}
          label="صافي الربح"
          value={formatCurrency(summary.netProfit, settings.currency)}
          tone="brand"
        />
      </div>

      <h2 className="mb-3 mt-8 text-base font-bold text-ink-900">سجل المصروفات</h2>
      <ExpenseList expenses={summary.expenses} currency={settings.currency} />
    </div>
  );
}
