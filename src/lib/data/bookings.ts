import { createClient } from "@/lib/supabase/server";
import { toDateKey } from "@/lib/utils";
import type { BookingStatus, Database } from "@/types/database";

export type BookingDateFilter = "today" | "tomorrow" | "week" | "all" | string;

export interface BookingFilters {
  date?: BookingDateFilter;
  status?: BookingStatus | "all";
}

export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"] & {
  customer: { name: string; phone: string } | null;
  serviceName: string;
};

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function getBookings(filters: BookingFilters): Promise<BookingRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });

  const today = new Date();
  const todayKey = toDateKey(today);

  if (filters.date === "today") {
    query = query.eq("booking_date", todayKey);
  } else if (filters.date === "tomorrow") {
    query = query.eq("booking_date", toDateKey(addDays(today, 1)));
  } else if (filters.date === "week") {
    query = query.gte("booking_date", todayKey).lte("booking_date", toDateKey(addDays(today, 7)));
  } else if (filters.date && filters.date !== "all") {
    query = query.eq("booking_date", filters.date);
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data: bookings } = await query.limit(200);
  if (!bookings || bookings.length === 0) return [];

  const customerIds = [...new Set(bookings.map((b) => b.customer_id))];
  const serviceIds = [...new Set(bookings.map((b) => b.service_id))];

  const [{ data: customers }, { data: services }] = await Promise.all([
    supabase.from("customers").select("id, name, phone").in("id", customerIds),
    supabase.from("services").select("id, name").in("id", serviceIds),
  ]);

  const customerMap = new Map((customers ?? []).map((c) => [c.id, c]));
  const serviceMap = new Map((services ?? []).map((s) => [s.id, s.name]));

  return bookings.map((booking) => ({
    ...booking,
    customer: customerMap.get(booking.customer_id)
      ? {
          name: customerMap.get(booking.customer_id)!.name,
          phone: customerMap.get(booking.customer_id)!.phone,
        }
      : null,
    serviceName: serviceMap.get(booking.service_id) ?? "",
  }));
}
