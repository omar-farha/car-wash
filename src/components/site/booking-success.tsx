import { CalendarCheck2, Car, Bike, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";

interface BookingSuccessProps {
  summary: {
    customerName: string;
    serviceName: string;
    vehicleLabel: "car" | "motorcycle";
    date: string;
    time: string;
  };
  onBookAnother: () => void;
}

export function BookingSuccess({ summary, onBookAnother }: BookingSuccessProps) {
  const VehicleIcon = summary.vehicleLabel === "car" ? Car : Bike;

  return (
    <div className="mx-auto max-w-lg animate-in fade-in-0 slide-in-up text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
        <CalendarCheck2 className="size-8 text-emerald-600" />
      </div>

      <h1 className="mt-5 text-2xl font-extrabold text-ink-900 sm:text-3xl">
        تم تأكيد حجزك بنجاح!
      </h1>
      <p className="mt-2 text-ink-500">
        نراك في الموعد المحدد، وسيتم إرسال تأكيد على رقم هاتفك
      </p>

      <Card className="mt-8 p-6 text-right">
        <dl className="divide-y divide-ink-100">
          <div className="flex items-center justify-between py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-500">
              <User className="size-4 text-brand-600" />
              الاسم
            </dt>
            <dd className="font-semibold text-ink-900">{summary.customerName}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-500">
              <VehicleIcon className="size-4 text-brand-600" />
              الخدمة
            </dt>
            <dd className="font-semibold text-ink-900">{summary.serviceName}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-500">
              <CalendarCheck2 className="size-4 text-brand-600" />
              التاريخ
            </dt>
            <dd className="font-semibold text-ink-900">{formatDate(summary.date)}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="flex items-center gap-2 text-sm text-ink-500">
              <Clock className="size-4 text-brand-600" />
              الوقت
            </dt>
            <dd className="font-semibold text-ink-900">{formatTime(summary.time)}</dd>
          </div>
        </dl>
      </Card>

      <Button variant="outline" size="lg" className="mt-8" onClick={onBookAnother}>
        حجز موعد آخر
      </Button>
    </div>
  );
}
