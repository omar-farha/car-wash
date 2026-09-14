import {
  Banknote,
  CalendarClock,
  Car,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { WashStatusBoard } from "@/components/dashboard/wash-status-board";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";
import { getFinancialOverview, getOperationalOverview } from "@/lib/data/dashboard";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const profile = await requireStaff();
  const isOwner = profile.role === "owner";

  const [settings, operational, financial] = await Promise.all([
    getSettings(),
    getOperationalOverview(),
    isOwner ? getFinancialOverview() : Promise.resolve(null),
  ]);

  return (
    <div>
      <PageHeader
        title={`مرحبًا، ${profile.full_name.split(" ")[0]}`}
        description="نظرة عامة على المغسلة الآن"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isOwner && financial && (
          <StatCard
            icon={Banknote}
            label="إيرادات اليوم"
            value={formatCurrency(financial.revenueToday, settings.currency)}
            tone="brand"
          />
        )}
        <StatCard
          icon={Car}
          label="عدد السيارات اليوم"
          value={String(operational.ordersToday)}
          tone="neutral"
        />
        {isOwner && financial && (
          <StatCard
            icon={TrendingUp}
            label="صافي الربح اليوم"
            value={formatCurrency(financial.netProfitToday, settings.currency)}
            tone="success"
          />
        )}
        <StatCard
          icon={CalendarClock}
          label="حجوزات اليوم"
          value={String(operational.bookingsToday)}
          tone="warning"
        />
        <StatCard
          icon={ClipboardList}
          label="الطلبات الحالية"
          value={String(operational.activeOrdersCount)}
          tone="neutral"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <WashStatusBoard counts={operational.statusCounts} />
        </div>

        {isOwner && financial && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>الإيرادات والمصروفات (آخر 7 أيام)</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={financial.weeklyChart} currency={settings.currency} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
