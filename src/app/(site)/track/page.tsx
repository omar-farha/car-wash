import type { Metadata } from "next";
import { TrackBookingForm } from "@/components/site/track-booking-form";

export const metadata: Metadata = { title: "تتبع حجزي" };

export default function TrackBookingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">تتبع حجزي</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-500">
          أدخل رقم الهاتف اللي حجزت بيه عشان تعرف حالة حجزك
        </p>
      </div>

      <TrackBookingForm />
    </section>
  );
}
