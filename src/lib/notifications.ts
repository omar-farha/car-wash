import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { NotificationType } from "@/types/database";

interface QueueNotificationInput {
  type: NotificationType;
  recipientPhone: string;
  bookingId?: string;
  orderId?: string;
  payload: Record<string, unknown>;
}

/**
 * Sends a WhatsApp message via the configured Business API, or queues the
 * notification as "skipped" when no credentials are set. Either way, this
 * never throws — a notification failure must never block a booking/order.
 */
export async function queueWhatsAppNotification(
  input: QueueNotificationInput,
) {
  const admin = createAdminClient();
  const configured =
    !!process.env.WHATSAPP_API_URL &&
    !!process.env.WHATSAPP_API_TOKEN &&
    !!process.env.WHATSAPP_PHONE_NUMBER_ID;

  const { data: notification, error } = await admin
    .from("notifications")
    .insert({
      type: input.type,
      recipient_phone: input.recipientPhone,
      booking_id: input.bookingId ?? null,
      order_id: input.orderId ?? null,
      payload: input.payload,
      status: configured ? "pending" : "skipped",
    })
    .select("id")
    .single();

  if (error || !notification) {
    console.error("Failed to queue notification", error);
    return;
  }

  if (!configured) return;

  try {
    const response = await fetch(
      `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: input.recipientPhone,
          type: "text",
          text: { body: buildMessageText(input.type, input.payload) },
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      await admin
        .from("notifications")
        .update({ status: "failed", error: text.slice(0, 500) })
        .eq("id", notification.id);
      return;
    }

    await admin
      .from("notifications")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", notification.id);
  } catch (err) {
    await admin
      .from("notifications")
      .update({
        status: "failed",
        error: err instanceof Error ? err.message.slice(0, 500) : "unknown error",
      })
      .eq("id", notification.id);
  }
}

function buildMessageText(
  type: NotificationType,
  payload: Record<string, unknown>,
) {
  const name = String(payload.customerName ?? "");
  switch (type) {
    case "booking_confirmation":
      return `مرحبًا ${name}، تم تأكيد حجزك في ${payload.businessName} بتاريخ ${payload.date} الساعة ${payload.time}. نتشرف بخدمتك!`;
    case "booking_reminder":
      return `تذكير: لديك موعد غدًا في ${payload.businessName} الساعة ${payload.time}. نراك قريبًا!`;
    case "order_ready":
      return `مرحبًا ${name}، سيارتك جاهزة للاستلام في ${payload.businessName}. شكرًا لثقتك بنا!`;
    default:
      return "";
  }
}
