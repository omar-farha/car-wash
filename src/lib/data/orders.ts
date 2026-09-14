import { createClient } from "@/lib/supabase/server";
import { sanitizeSearchTerm, toDateKey } from "@/lib/utils";
import type { Database, OrderStatus } from "@/types/database";

export interface OrderFilters {
  q?: string;
  status?: OrderStatus | "all";
  date?: "today" | "all" | string;
  employeeId?: string;
  serviceId?: string;
}

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"] & {
  customer: { name: string; phone: string } | null;
  employee: { full_name: string } | null;
  invoiceId: string | null;
};

export async function getOrders(filters: OrderFilters): Promise<OrderRow[]> {
  const supabase = await createClient();

  const q = filters.q ? sanitizeSearchTerm(filters.q) : "";

  let matchedCustomerIds: string[] | null = null;
  if (q) {
    const { data: matches } = await supabase
      .from("customers")
      .select("id")
      .or(`name.ilike.%${q}%,phone.ilike.%${q}%`);
    matchedCustomerIds = (matches ?? []).map((c) => c.id);
  }

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.employeeId) {
    query = query.eq("created_by", filters.employeeId);
  }
  if (filters.serviceId) {
    query = query.eq("service_id", filters.serviceId);
  }
  if (filters.date === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query = query.gte("created_at", start.toISOString()).lt("created_at", end.toISOString());
  } else if (filters.date && filters.date !== "all") {
    const start = new Date(`${filters.date}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query = query.gte("created_at", start.toISOString()).lt("created_at", end.toISOString());
  }
  if (q) {
    if (matchedCustomerIds && matchedCustomerIds.length > 0) {
      query = query.or(
        `service_name.ilike.%${q}%,customer_id.in.(${matchedCustomerIds.join(",")})`,
      );
    } else {
      query = query.ilike("service_name", `%${q}%`);
    }
  }

  const { data: orders } = await query.limit(200);
  if (!orders || orders.length === 0) return [];

  const customerIds = [...new Set(orders.map((o) => o.customer_id))];
  const employeeIds = [...new Set(orders.map((o) => o.created_by).filter(Boolean))] as string[];
  const completedOrderIds = orders.filter((o) => o.status === "completed").map((o) => o.id);

  const [{ data: customers }, { data: employees }, { data: invoices }] = await Promise.all([
    supabase.from("customers").select("id, name, phone").in("id", customerIds),
    employeeIds.length > 0
      ? supabase.from("profiles").select("id, full_name").in("id", employeeIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
    completedOrderIds.length > 0
      ? supabase.from("invoices").select("id, order_id").in("order_id", completedOrderIds)
      : Promise.resolve({ data: [] as { id: string; order_id: string }[] }),
  ]);

  const customerMap = new Map((customers ?? []).map((c) => [c.id, c]));
  const employeeMap = new Map((employees ?? []).map((e) => [e.id, e]));
  const invoiceMap = new Map((invoices ?? []).map((i) => [i.order_id, i.id]));

  return orders.map((order) => ({
    ...order,
    customer: customerMap.get(order.customer_id)
      ? {
          name: customerMap.get(order.customer_id)!.name,
          phone: customerMap.get(order.customer_id)!.phone,
        }
      : null,
    employee: order.created_by && employeeMap.get(order.created_by)
      ? { full_name: employeeMap.get(order.created_by)!.full_name }
      : null,
    invoiceId: invoiceMap.get(order.id) ?? null,
  }));
}

export function toDateFilterKey(date: Date) {
  return toDateKey(date);
}
