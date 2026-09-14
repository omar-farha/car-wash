"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Car, Bike, Phone, User, CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatTime } from "@/lib/utils";
import { updateBookingStatus, convertBookingToOrder } from "@/lib/actions/bookings";
import type { BookingRow } from "@/lib/data/bookings";
import type { BookingStatus } from "@/types/database";

export function BookingCard({ booking }: { booking: BookingRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const VehicleIcon = booking.vehicle_type === "car" ? Car : Bike;
  const isTerminal = booking.status === "completed" || booking.status === "cancelled";

  function setStatus(status: BookingStatus) {
    startTransition(async () => {
      const result = await updateBookingStatus(booking.id, status);
      if (result.success) router.refresh();
      else toast.error(result.error);
    });
  }

  function handleConvert() {
    startTransition(async () => {
      const result = await convertBookingToOrder(booking.id);
      if (result.success) {
        toast.success("تم تحويل الحجز إلى طلب");
        router.push("/dashboard/orders");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
          <VehicleIcon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-semibold text-ink-900">
            <User className="size-3.5 text-ink-400" />
            {booking.customer?.name}
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-500">
            <span className="flex items-center gap-1" dir="ltr">
              <Phone className="size-3" />
              {booking.customer?.phone}
            </span>
            <span className="flex items-center gap-1">
              <CalendarClock className="size-3" />
              {formatDate(booking.booking_date)} — {formatTime(booking.booking_time)}
            </span>
          </p>
          <p className="mt-0.5 text-xs font-medium text-ink-600">{booking.serviceName}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <BookingStatusBadge status={booking.status} />

        {!isTerminal && !booking.order_id && (
          <>
            {booking.status === "pending" && (
              <Button size="sm" variant="outline" onClick={() => setStatus("arrived")} disabled={pending}>
                تسجيل الوصول
              </Button>
            )}
            {booking.status === "arrived" && (
              <Button size="sm" variant="outline" onClick={() => setStatus("in_service")} disabled={pending}>
                بدء الخدمة
              </Button>
            )}
            <Button size="sm" onClick={handleConvert} disabled={pending}>
              تحويل إلى طلب
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setStatus("cancelled")}
              disabled={pending}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              إلغاء
            </Button>
          </>
        )}

        {pending && <Loader2 className="size-4 animate-spin text-ink-400" />}
      </div>
    </Card>
  );
}
