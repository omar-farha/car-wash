"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { bookingFormSchema } from "@/lib/validations";
import { queueWhatsAppNotification } from "@/lib/notifications";
import { WORKING_HOURS } from "@/lib/constants";
import { formatDate, formatTime, toDateKey } from "@/lib/utils";
import type { BookingStatus, VehicleType } from "@/types/database";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

function generateDaySlots() {
  const slots: string[] = [];
  const [startH, startM] = WORKING_HOURS.start.split(":").map(Number);
  const [endH, endM] = WORKING_HOURS.end.split(":").map(Number);
  let minutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (minutes < endMinutes) {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    minutes += WORKING_HOURS.slotMinutes;
  }
  return slots;
}

/** Public: returns the free time slots for a given date (YYYY-MM-DD). */
export async function getAvailableSlots(
  date: string,
): Promise<ActionResult<string[]>> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { success: false, error: "تاريخ غير صحيح" };
  }

  const admin = createAdminClient();
  const { data: bookings, error } = await admin
    .from("bookings")
    .select("booking_time")
    .eq("booking_date", date)
    .neq("status", "cancelled");

  if (error) {
    return { success: false, error: "تعذر تحميل المواعيد المتاحة" };
  }

  const taken = new Set(bookings.map((b) => b.booking_time.slice(0, 5)));
  const allSlots = generateDaySlots();
  const available = allSlots.filter((slot) => !taken.has(slot));

  return { success: true, data: available };
}

/** Public: creates a booking. No account required. */
export async function createBooking(input: unknown): Promise<
  ActionResult<{
    customerName: string;
    serviceName: string;
    vehicleLabel: VehicleType;
    date: string;
    time: string;
  }>
> {
  const parsed = bookingFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const values = parsed.data;

  const todayKey = toDateKey(new Date());
  if (values.bookingDate < todayKey) {
    return { success: false, error: "لا يمكن الحجز في تاريخ سابق" };
  }

  const admin = createAdminClient();

  const { data: service } = await admin
    .from("services")
    .select("id, name, is_active")
    .eq("id", values.serviceId)
    .maybeSingle();

  if (!service || !service.is_active) {
    return { success: false, error: "الخدمة المختارة غير متاحة" };
  }

  let customerId: string;
  const { data: existingCustomer } = await admin
    .from("customers")
    .select("id")
    .eq("phone", values.phone)
    .maybeSingle();

  if (existingCustomer) {
    customerId = existingCustomer.id;
    await admin
      .from("customers")
      .update({ name: values.name })
      .eq("id", customerId);
  } else {
    const { data: newCustomer, error: customerError } = await admin
      .from("customers")
      .insert({ name: values.name, phone: values.phone })
      .select("id")
      .single();

    if (customerError || !newCustomer) {
      return { success: false, error: "تعذر حفظ بيانات العميل" };
    }
    customerId = newCustomer.id;
  }

  const { error: bookingError } = await admin.from("bookings").insert({
    customer_id: customerId,
    service_id: service.id,
    vehicle_type: values.vehicleType,
    booking_date: values.bookingDate,
    booking_time: values.bookingTime,
    status: "pending",
  });

  if (bookingError) {
    if (bookingError.code === "23505") {
      return {
        success: false,
        error: "هذا الموعد تم حجزه للتو، برجاء اختيار وقت آخر",
      };
    }
    return { success: false, error: "تعذر إتمام الحجز، حاول مرة أخرى" };
  }

  const { data: settings } = await admin
    .from("settings")
    .select("business_name")
    .eq("id", 1)
    .maybeSingle();

  const businessName = settings?.business_name ?? "مغسلة السيارات";

  await queueWhatsAppNotification({
    type: "booking_confirmation",
    recipientPhone: values.phone,
    payload: {
      customerName: values.name,
      businessName,
      date: formatDate(values.bookingDate),
      time: formatTime(values.bookingTime),
    },
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");

  return {
    success: true,
    data: {
      customerName: values.name,
      serviceName: service.name,
      vehicleLabel: values.vehicleType,
      date: values.bookingDate,
      time: values.bookingTime,
    },
  };
}

const NON_TERMINAL: BookingStatus[] = ["pending", "arrived", "in_service"];

/** Staff: updates a booking's status (arrival, in-service, cancel, etc.). */
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("status")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) return { success: false, error: "الحجز غير موجود" };
  if (!NON_TERMINAL.includes(booking.status)) {
    return { success: false, error: "لا يمكن تعديل حجز منتهي" };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) return { success: false, error: "تعذر تحديث حالة الحجز" };

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

/** Staff: converts an arrived booking into a walk-in-style order. */
export async function convertBookingToOrder(
  bookingId: string,
): Promise<ActionResult<{ orderId: string }>> {
  const profile = await requireStaff();
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, order_id, customer_id, service_id, vehicle_type")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) return { success: false, error: "الحجز غير موجود" };
  if (booking.order_id) return { success: false, error: "تم تحويل هذا الحجز بالفعل" };
  if (!NON_TERMINAL.includes(booking.status)) {
    return { success: false, error: "لا يمكن تحويل حجز منتهي" };
  }

  const { data: service } = await supabase
    .from("services")
    .select("name, car_price, motorcycle_price")
    .eq("id", booking.service_id)
    .maybeSingle();

  if (!service) return { success: false, error: "الخدمة غير موجودة" };

  const price =
    booking.vehicle_type === "car" ? service.car_price : service.motorcycle_price;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: booking.customer_id,
      booking_id: booking.id,
      service_id: booking.service_id,
      service_name: service.name,
      vehicle_type: booking.vehicle_type,
      price,
      status: "waiting",
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, error: "تعذر إنشاء الطلب" };
  }

  await supabase
    .from("bookings")
    .update({ status: "completed", order_id: order.id })
    .eq("id", bookingId);

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");

  return { success: true, data: { orderId: order.id } };
}
