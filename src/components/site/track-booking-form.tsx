"use client";

import { useState, useTransition } from "react";
import { Search, Car, Bike, CalendarClock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getBookingsByPhone, type TrackedBooking } from "@/lib/actions/bookings";
import { phoneSchema } from "@/lib/validations";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_STYLES } from "@/lib/constants";
import { cn, formatDate, formatTime } from "@/lib/utils";

export function TrackBookingForm() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TrackedBooking[] | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "رقم هاتف غير صحيح");
      return;
    }

    startTransition(async () => {
      const result = await getBookingsByPhone(parsed.data);
      if (result.success) {
        setResults(result.data);
      } else {
        setError(result.error);
        setResults(null);
      }
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="track-phone">رقم الهاتف المستخدم في الحجز</Label>
            <Input
              id="track-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              dir="ltr"
              className="text-right"
              inputMode="numeric"
            />
          </div>
          <Button type="submit" size="lg" loading={pending} className="sm:mb-0">
            <Search className="size-4" />
            بحث
          </Button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Card>

      {pending && (
        <div className="mt-8 flex items-center justify-center gap-2 text-ink-400">
          <Loader2 className="size-5 animate-spin" />
          جارِ البحث...
        </div>
      )}

      {!pending && results && results.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={CalendarClock}
            title="لا توجد حجوزات بهذا الرقم"
            description="تأكد من رقم الهاتف الذي استخدمته وقت الحجز"
          />
        </div>
      )}

      {!pending && results && results.length > 0 && (
        <div className="mt-8 space-y-3">
          {results.map((booking) => {
            const VehicleIcon = booking.vehicleType === "car" ? Car : Bike;
            return (
              <Card key={booking.id} className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                    <VehicleIcon className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">{booking.serviceName}</p>
                    <p className="text-xs text-ink-500">
                      {formatDate(booking.bookingDate)} — {formatTime(booking.bookingTime)}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                    BOOKING_STATUS_STYLES[booking.status],
                  )}
                >
                  {BOOKING_STATUS_LABELS[booking.status]}
                </span>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
