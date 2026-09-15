import { CalendarSearch } from "lucide-react";
import { Reveal } from "@/components/site/home/reveal";
import { TrackBookingForm } from "@/components/site/track-booking-form";

export function TrackSection() {
  return (
    <section id="track" className="scroll-mt-20 border-t border-ink-100 bg-ink-50/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-10 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <CalendarSearch className="size-6" />
          </span>
          <p className="mt-4 text-sm font-bold text-brand-600">حجزت قبل كده؟</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
            تتبع حالة حجزك
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-500">
            أدخل رقم الهاتف اللي حجزت بيه وشوف حالة حجزك في ثانية
          </p>
        </Reveal>

        <Reveal delay={100}>
          <TrackBookingForm />
        </Reveal>
      </div>
    </section>
  );
}
