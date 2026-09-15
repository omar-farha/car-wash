import type { Metadata } from "next";
import {
  Banknote,
  TrendingDown,
  Wallet,
  ClipboardList,
  Car,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { FinanceRangeFilter } from "@/components/dashboard/finance/finance-range-filter";
import { PrintButton } from "@/components/dashboard/print-button";
import { TopServicesChart } from "@/components/dashboard/reports/top-services-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { requireOwner } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";
import { getReportSummary } from "@/lib/data/reports";
import type { FinanceRange } from "@/lib/data/date-range";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "التقارير" };

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  await requireOwner();

  const [settings, report] = await Promise.all([
    getSettings(),
    getReportSummary({
      range: (params.range as FinanceRange) ?? "month",
      from: params.from,
      to: params.to,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="التقارير"
        description="أداء المغسلة خلال الفترة المحددة"
        action={
          <div className="no-print">
            <PrintButton label="طباعة التقرير / PDF" />
          </div>
        }
      />

      <div className="no-print">
        <FinanceRangeFilter />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Banknote}
          label="إجمالي الإيرادات"
          value={formatCurrency(report.totalRevenue, settings.currency)}
          tone="success"
        />
        <StatCard
          icon={TrendingDown}
          label="إجمالي المصروفات"
          value={formatCurrency(report.totalExpenses, settings.currency)}
          tone="warning"
        />
        <StatCard
          icon={Wallet}
          label="صافي الربح"
          value={formatCurrency(report.netProfit, settings.currency)}
          tone="brand"
        />
        <StatCard icon={ClipboardList} label="عدد الطلبات" value={String(report.totalOrders)} />
        <StatCard icon={Car} label="عدد السيارات" value={String(report.totalCars)} />
        <StatCard
          icon={CheckCircle2}
          label="طلبات مكتملة"
          value={String(report.completedOrders)}
          tone="success"
        />
        <StatCard
          icon={XCircle}
          label="طلبات ملغاة"
          value={String(report.cancelledOrders)}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-4 text-brand-600" />
              الخدمات الأكثر طلبًا
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.topServices.length === 0 ? (
              <EmptyState icon={BarChart3} title="لا توجد بيانات كافية" />
            ) : (
              <TopServicesChart data={report.topServices} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-4 text-brand-600" />
              أداء الموظفين
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.employeePerformance.length === 0 ? (
              <EmptyState icon={Users} title="لا توجد طلبات مكتملة في هذه الفترة" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الموظف</TableHead>
                    <TableHead>طلبات مكتملة</TableHead>
                    <TableHead>الإيرادات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.employeePerformance.map((emp) => (
                    <TableRow key={emp.name}>
                      <TableCell className="font-medium text-ink-900">{emp.name}</TableCell>
                      <TableCell>{emp.completedOrders}</TableCell>
                      <TableCell className="font-semibold text-brand-700">
                        {formatCurrency(emp.revenue, settings.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
