import { createClient } from "@/lib/supabase/server";
import { toDateKey } from "@/lib/utils";
import { getRangeBounds, type FinanceFilters } from "@/lib/data/date-range";

export interface ReportSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
  totalCars: number;
  completedOrders: number;
  cancelledOrders: number;
  topServices: { name: string; count: number }[];
  employeePerformance: { name: string; completedOrders: number; revenue: number }[];
}

export async function getReportSummary(filters: FinanceFilters): Promise<ReportSummary> {
  const supabase = await createClient();
  const { start, end } = getRangeBounds(filters);
  const startKey = toDateKey(start);
  const endKey = toDateKey(new Date(end.getTime() - 1));

  const [{ data: orders }, { data: invoices }, { data: expenses }] = await Promise.all([
    supabase
      .from("orders")
      .select("service_name, vehicle_type, status, created_by, price")
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString()),
    supabase
      .from("invoices")
      .select("price")
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString()),
    supabase
      .from("expenses")
      .select("amount")
      .gte("expense_date", startKey)
      .lte("expense_date", endKey),
  ]);

  const totalRevenue = (invoices ?? []).reduce((sum, i) => sum + Number(i.price), 0);
  const totalExpenses = (expenses ?? []).reduce((sum, e) => sum + Number(e.amount), 0);

  const allOrders = orders ?? [];
  const totalOrders = allOrders.length;
  const totalCars = allOrders.filter((o) => o.vehicle_type === "car").length;
  const completedOrdersList = allOrders.filter((o) => o.status === "completed");
  const completedOrders = completedOrdersList.length;
  const cancelledOrders = allOrders.filter((o) => o.status === "cancelled").length;

  const serviceCounts = new Map<string, number>();
  for (const order of allOrders) {
    serviceCounts.set(order.service_name, (serviceCounts.get(order.service_name) ?? 0) + 1);
  }
  const topServices = [...serviceCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const employeeIds = [
    ...new Set(completedOrdersList.map((o) => o.created_by).filter(Boolean)),
  ] as string[];
  const { data: employeeProfiles } =
    employeeIds.length > 0
      ? await supabase.from("profiles").select("id, full_name").in("id", employeeIds)
      : { data: [] as { id: string; full_name: string }[] };
  const employeeNameMap = new Map((employeeProfiles ?? []).map((e) => [e.id, e.full_name]));

  const employeeStats = new Map<string, { completedOrders: number; revenue: number }>();
  for (const order of completedOrdersList) {
    if (!order.created_by) continue;
    const current = employeeStats.get(order.created_by) ?? { completedOrders: 0, revenue: 0 };
    current.completedOrders += 1;
    current.revenue += Number(order.price);
    employeeStats.set(order.created_by, current);
  }

  const employeePerformance = [...employeeStats.entries()]
    .map(([id, stats]) => ({ name: employeeNameMap.get(id) ?? "موظف", ...stats }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    totalOrders,
    totalCars,
    completedOrders,
    cancelledOrders,
    topServices,
    employeePerformance,
  };
}
