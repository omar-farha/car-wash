import { DATE_GROUP_ACCENTS, dateGroupLabel } from "@/lib/date-grouping";
import { BookingCard } from "@/components/dashboard/bookings/booking-card";
import type { BookingRow } from "@/lib/data/bookings";

export function BookingsGroupedList({ bookings }: { bookings: BookingRow[] }) {
  const groups = new Map<string, BookingRow[]>();
  for (const booking of bookings) {
    const key = booking.booking_date;
    const list = groups.get(key) ?? [];
    list.push(booking);
    groups.set(key, list);
  }

  const sortedKeys = [...groups.keys()].sort((a, b) => (a < b ? -1 : 1));

  return (
    <div className="space-y-8">
      {sortedKeys.map((key, index) => {
        const groupBookings = groups.get(key)!;
        const accent = DATE_GROUP_ACCENTS[index % DATE_GROUP_ACCENTS.length];
        return (
          <section key={key}>
            <div className="mb-3 flex items-center gap-2.5">
              <span className={`size-2.5 shrink-0 rounded-full ${accent}`} />
              <h2 className="text-sm font-bold text-ink-900">{dateGroupLabel(key)}</h2>
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-500">
                {groupBookings.length}
              </span>
              <span className="h-px flex-1 bg-ink-100" />
            </div>
            <div className="space-y-3">
              {groupBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
