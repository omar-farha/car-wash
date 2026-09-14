import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { BookingFilters } from "@/components/dashboard/bookings/booking-filters";
import { BookingCard } from "@/components/dashboard/bookings/booking-card";
import { requireStaff } from "@/lib/auth";
import { getBookings } from "@/lib/data/bookings";
import type { BookingStatus } from "@/types/database";

export const metadata: Metadata = { title: "الحجوزات" };

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  await requireStaff();

  const bookings = await getBookings({
    date: params.date ?? "today",
    status: (params.status as BookingStatus | undefined) ?? "all",
  });

  return (
    <div>
      <PageHeader title="الحجوزات" description="متابعة وإدارة حجوزات العملاء" />

      <BookingFilters />

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="لا توجد حجوزات"
          description="لا توجد حجوزات مطابقة لهذا الفلتر"
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
