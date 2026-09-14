"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { walkInOrderSchema } from "@/lib/validations";
import { queueWhatsAppNotification } from "@/lib/notifications";
import type { OrderStatus } from "@/types/database";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

/** Staff: creates an order directly for a walk-in customer. */
export async function createWalkInOrder(
  input: unknown,
): Promise<ActionResult<{ orderId: string }>> {
  const profile = await requireStaff();
  const parsed = walkInOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const values = parsed.data;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("id, name, car_price, motorcycle_price, is_active")
    .eq("id", values.serviceId)
    .maybeSingle();

  if (!service || !service.is_active) {
    return { success: false, error: "الخدمة المختارة غير متاحة" };
  }

  let customerId: string;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", values.phone)
    .maybeSingle();

  if (existingCustomer) {
    customerId = existingCustomer.id;
    await supabase
      .from("customers")
      .update({ name: values.name })
      .eq("id", customerId);
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from("customers")
      .insert({ name: values.name, phone: values.phone })
      .select("id")
      .single();

    if (customerError || !newCustomer) {
      return { success: false, error: "تعذر حفظ بيانات العميل" };
    }
    customerId = newCustomer.id;
  }

  const price =
    values.vehicleType === "car" ? service.car_price : service.motorcycle_price;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      service_id: service.id,
      service_name: service.name,
      vehicle_type: values.vehicleType,
      price,
      status: "waiting",
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, error: "تعذر إنشاء الطلب" };
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");

  return { success: true, data: { orderId: order.id } };
}

const ADVANCEABLE_STATUSES: OrderStatus[] = [
  "waiting",
  "washing",
  "cleaning",
  "ready",
  "cancelled",
];

/** Staff: moves an order along the wash workflow, or cancels it. */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<ActionResult> {
  await requireStaff();

  if (!ADVANCEABLE_STATUSES.includes(status)) {
    return { success: false, error: "استخدم زر إتمام الطلب لإنهاء الطلب" };
  }

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("status, customer_id, service_name")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return { success: false, error: "الطلب غير موجود" };
  if (order.status === "completed" || order.status === "cancelled") {
    return { success: false, error: "لا يمكن تعديل طلب منتهي" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return { success: false, error: "تعذر تحديث حالة الطلب" };

  if (status === "ready") {
    const { data: customer } = await supabase
      .from("customers")
      .select("name, phone")
      .eq("id", order.customer_id)
      .maybeSingle();
    const { data: settings } = await supabase
      .from("settings")
      .select("business_name")
      .eq("id", 1)
      .maybeSingle();

    if (customer) {
      await queueWhatsAppNotification({
        type: "order_ready",
        recipientPhone: customer.phone,
        orderId,
        payload: {
          customerName: customer.name,
          businessName: settings?.business_name ?? "مغسلة السيارات",
        },
      });
    }
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

/**
 * Staff: completes an order — marks it done, records the cash payment,
 * and generates the invoice. This is the single source of truth for
 * revenue recognition.
 */
export async function completeOrder(
  orderId: string,
): Promise<ActionResult<{ invoiceId: string }>> {
  await requireStaff();
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, customer_id, service_name, vehicle_type, price")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return { success: false, error: "الطلب غير موجود" };
  if (order.status === "completed") {
    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle();
    if (existingInvoice) {
      return { success: true, data: { invoiceId: existingInvoice.id } };
    }
    return { success: false, error: "الطلب مكتمل بالفعل" };
  }
  if (order.status === "cancelled") {
    return { success: false, error: "لا يمكن إتمام طلب ملغي" };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", orderId);

  if (updateError) return { success: false, error: "تعذر إتمام الطلب" };

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      order_id: order.id,
      customer_id: order.customer_id,
      service_name: order.service_name,
      vehicle_type: order.vehicle_type,
      price: order.price,
      payment_method: "cash",
    })
    .select("id")
    .single();

  if (invoiceError || !invoice) {
    return { success: false, error: "تم إتمام الطلب لكن تعذر إنشاء الفاتورة" };
  }

  await supabase.from("payments").insert({
    invoice_id: invoice.id,
    amount: order.price,
    method: "cash",
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/finance");
  revalidatePath("/dashboard/customers");

  return { success: true, data: { invoiceId: invoice.id } };
}
