import { createClient } from "@/lib/supabase/server";
import { toDateKey } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function getOperationalOverview() {
  const supabase = await createClient();
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const todayKey = toDateKey(today);

  const [{ data: activeOrders }, { count: bookingsToday }, { count: ordersToday }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("status")
        .not("status", "in", "(completed,cancelled)"),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("booking_date", todayKey)
        .neq("status", "cancelled"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .gte("created_at", today.toISOString())
        .lt("created_at", tomorrow.toISOString()),
    ]);

  const statusCounts: Record<OrderStatus, number> = {
    waiting: 0,
    washing: 0,
    cleaning: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const order of activeOrders ?? []) {
    statusCounts[order.status] += 1;
  }

  return {
    bookingsToday: bookingsToday ?? 0,
    ordersToday: ordersToday ?? 0,
    activeOrdersCount: (activeOrders ?? []).length,
    statusCounts,
  };
}

export async function getFinancialOverview() {
  const supabase = await createClient();
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const todayKey = toDateKey(today);
  const sevenDaysAgo = addDays(today, -6);
  const sevenDaysAgoKey = toDateKey(sevenDaysAgo);

  const [{ data: todayInvoices }, { data: todayExpenses }, { data: weekInvoices }, { data: weekExpenses }] =
    await Promise.all([
      supabase
        .from("invoices")
        .select("price")
        .gte("created_at", today.toISOString())
        .lt("created_at", tomorrow.toISOString()),
      supabase.from("expenses").select("amount").eq("expense_date", todayKey),
      supabase
        .from("invoices")
        .select("price, created_at")
        .gte("created_at", sevenDaysAgo.toISOString())
        .lt("created_at", tomorrow.toISOString()),
      supabase
        .from("expenses")
        .select("amount, expense_date")
        .gte("expense_date", sevenDaysAgoKey)
        .lte("expense_date", todayKey),
    ]);

  const revenueToday = (todayInvoices ?? []).reduce((sum, i) => sum + Number(i.price), 0);
  const expensesToday = (todayExpenses ?? []).reduce((sum, e) => sum + Number(e.amount), 0);

  const days: { key: string; label: string; revenue: number; expenses: number }[] = [];
  const labelFmt = new Intl.DateTimeFormat("ar-EG", { weekday: "short" });
  for (let i = 0; i < 7; i++) {
    const date = addDays(sevenDaysAgo, i);
    days.push({ key: toDateKey(date), label: labelFmt.format(date), revenue: 0, expenses: 0 });
  }
  const dayMap = new Map(days.map((d) => [d.key, d]));

  for (const invoice of weekInvoices ?? []) {
    const key = toDateKey(new Date(invoice.created_at));
    const day = dayMap.get(key);
    if (day) day.revenue += Number(invoice.price);
  }
  for (const expense of weekExpenses ?? []) {
    const day = dayMap.get(expense.expense_date);
    if (day) day.expenses += Number(expense.amount);
  }

  return {
    revenueToday,
    expensesToday,
    netProfitToday: revenueToday - expensesToday,
    weeklyChart: days,
  };
}
