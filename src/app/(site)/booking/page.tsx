import type { Metadata } from "next";
import { BookingForm } from "@/components/site/booking-form";
import { getSettings } from "@/lib/data/settings";
import { getActiveServices } from "@/lib/data/services";

export const metadata: Metadata = { title: "احجز موعدك" };

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [{ service }, settings, services] = await Promise.all([
    searchParams,
    getSettings(),
    getActiveServices(),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <BookingForm
        services={services}
        currency={settings.currency}
        preselectedServiceId={service}
      />
    </section>
  );
}
