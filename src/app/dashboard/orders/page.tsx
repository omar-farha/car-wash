import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderFilters } from "@/components/dashboard/orders/order-filters";
import { OrdersGroupedList } from "@/components/dashboard/orders/orders-grouped-list";
import { NewOrderDialog } from "@/components/dashboard/orders/new-order-dialog";
import { ExportOrdersButton } from "@/components/dashboard/orders/export-orders-button";
import { requireStaff } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";
import { getOrders } from "@/lib/data/orders";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types/database";

export const metadata: Metadata = { title: "الطلبات" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  await requireStaff();
  const supabase = await createClient();

  const [settings, orders, { data: allServices }, { data: employees }, { data: activeServices }] =
    await Promise.all([
      getSettings(),
      getOrders({
        q: params.q,
        status: (params.status as OrderStatus | undefined) ?? "all",
        date: params.date ?? "all",
        employeeId: params.employeeId,
        serviceId: params.serviceId,
      }),
      supabase.from("services").select("id, name").order("name"),
      supabase.from("profiles").select("id, full_name").order("full_name"),
      supabase.from("services").select("*").eq("is_active", true).order("name"),
    ]);

  return (
    <div>
      <PageHeader
        title="الطلبات"
        description="إدارة كل طلبات الغسيل الحالية والسابقة"
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <ExportOrdersButton data={orders} />
            <NewOrderDialog services={activeServices ?? []} currency={settings.currency} />
          </div>
        }
      />

      <OrderFilters
        employees={(employees ?? []).map((e) => ({ id: e.id, label: e.full_name }))}
        services={(allServices ?? []).map((s) => ({ id: s.id, label: s.name }))}
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="لا توجد طلبات"
          description="ستظهر هنا الطلبات الجديدة فور إنشائها"
        />
      ) : (
        <OrdersGroupedList orders={orders} currency={settings.currency} />
      )}
    </div>
  );
}
