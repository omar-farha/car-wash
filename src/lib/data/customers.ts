import { createClient } from "@/lib/supabase/server";
import { sanitizeSearchTerm } from "@/lib/utils";
import type { OrderStatus, VehicleType } from "@/types/database";

export interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  visits: number;
  totalPayments: number;
  lastVisit: string | null;
}

export async function getCustomers(search?: string): Promise<CustomerSummary[]> {
  const supabase = await createClient();

  let customerQuery = supabase
    .from("customers")
    .select("id, name, phone")
    .order("created_at", { ascending: false })
    .limit(500);

  if (search) {
    const q = sanitizeSearchTerm(search);
    if (q) customerQuery = customerQuery.or(`name.ilike.%${q}%,phone.ilike.%${q}%`);
  }

  const { data: customers } = await customerQuery;
  if (!customers || customers.length === 0) return [];

  const customerIds = customers.map((c) => c.id);
  const { data: invoices } = await supabase
    .from("invoices")
    .select("customer_id, price, created_at")
    .in("customer_id", customerIds);

  const statsMap = new Map<string, { visits: number; total: number; last: string | null }>();
  for (const invoice of invoices ?? []) {
    const current = statsMap.get(invoice.customer_id) ?? { visits: 0, total: 0, last: null };
    current.visits += 1;
    current.total += Number(invoice.price);
    if (!current.last || invoice.created_at > current.last) {
      current.last = invoice.created_at;
    }
    statsMap.set(invoice.customer_id, current);
  }

  return customers.map((customer) => {
    const stats = statsMap.get(customer.id) ?? { visits: 0, total: 0, last: null };
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      visits: stats.visits,
      totalPayments: stats.total,
      lastVisit: stats.last,
    };
  });
}

export interface CustomerOrderHistory {
  id: string;
  serviceName: string;
  vehicleType: VehicleType;
  price: number;
  status: OrderStatus;
  createdAt: string;
}

export async function getCustomerDetail(customerId: string) {
  const supabase = await createClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();

  if (!customer) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("id, service_name, vehicle_type, price, status, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  const history: CustomerOrderHistory[] = (orders ?? []).map((o) => ({
    id: o.id,
    serviceName: o.service_name,
    vehicleType: o.vehicle_type,
    price: o.price,
    status: o.status,
    createdAt: o.created_at,
  }));

  const { data: invoices } = await supabase
    .from("invoices")
    .select("price")
    .eq("customer_id", customerId);

  const totalPayments = (invoices ?? []).reduce((sum, i) => sum + Number(i.price), 0);

  return { customer, history, totalPayments };
}
