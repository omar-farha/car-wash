import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { queueWhatsAppNotification } from "@/lib/notifications";
import { formatTime, toDateKey } from "@/lib/utils";

/**
 * Queues WhatsApp reminders for tomorrow's confirmed bookings. Not called
 * automatically by this app — connect it to a scheduler (e.g. Vercel Cron,
 * "0 18 * * *") that sends a Bearer CRON_SECRET header once a day.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const admin = createAdminClient();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = toDateKey(tomorrow);

  const { data: bookings } = await admin
    .from("bookings")
    .select("id, booking_time, customer_id")
    .eq("booking_date", tomorrowKey)
    .in("status", ["pending", "arrived"]);

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ queued: 0 });
  }

  const { data: settings } = await admin
    .from("settings")
    .select("business_name")
    .eq("id", 1)
    .maybeSingle();
  const businessName = settings?.business_name ?? "مغسلة السيارات";

  const customerIds = [...new Set(bookings.map((b) => b.customer_id))];
  const { data: customers } = await admin
    .from("customers")
    .select("id, name, phone")
    .in("id", customerIds);
  const customerMap = new Map((customers ?? []).map((c) => [c.id, c]));

  let queued = 0;
  for (const booking of bookings) {
    const customer = customerMap.get(booking.customer_id);
    if (!customer) continue;
    await queueWhatsAppNotification({
      type: "booking_reminder",
      recipientPhone: customer.phone,
      bookingId: booking.id,
      payload: {
        customerName: customer.name,
        businessName,
        time: formatTime(booking.booking_time.slice(0, 5)),
      },
    });
    queued += 1;
  }

  return NextResponse.json({ queued });
}
