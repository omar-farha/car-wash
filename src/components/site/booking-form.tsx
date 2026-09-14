"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Car, Bike, Loader2, ArrowLeft, ArrowRight, CalendarX2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatCurrency, formatTime, toDateKey } from "@/lib/utils";
import { createBooking, getAvailableSlots } from "@/lib/actions/bookings";
import { bookingFormSchema } from "@/lib/validations";
import { BookingSuccess } from "@/components/site/booking-success";
import type { Database } from "@/types/database";
import type { VehicleType } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface BookingFormProps {
  services: Service[];
  currency: string;
  preselectedServiceId?: string;
}

const STEPS = ["الخدمة", "الموعد", "بياناتك"] as const;

function buildUpcomingDays(count: number) {
  const days: { key: string; weekday: string; day: string; month: string }[] = [];
  const weekdayFmt = new Intl.DateTimeFormat("ar-EG", { weekday: "short" });
  const monthFmt = new Intl.DateTimeFormat("ar-EG", { month: "short" });

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      key: toDateKey(date),
      weekday: weekdayFmt.format(date),
      day: String(date.getDate()),
      month: monthFmt.format(date),
    });
  }
  return days;
}

export function BookingForm({ services, currency, preselectedServiceId }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [serviceId, setServiceId] = useState(preselectedServiceId ?? "");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsPending, startSlotsTransition] = useTransition();
  const [submitPending, startSubmitTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    customerName: string;
    serviceName: string;
    vehicleLabel: VehicleType;
    date: string;
    time: string;
  } | null>(null);

  const days = useMemo(() => buildUpcomingDays(14), []);
  const selectedService = services.find((s) => s.id === serviceId);

  useEffect(() => {
    if (!bookingDate) return;
    startSlotsTransition(async () => {
      const result = await getAvailableSlots(bookingDate);
      if (result.success) {
        const now = new Date();
        const isToday = bookingDate === toDateKey(now);
        const filtered = isToday
          ? result.data.filter((slot) => {
              const [h, m] = slot.split(":").map(Number);
              const slotDate = new Date();
              slotDate.setHours(h, m, 0, 0);
              return slotDate.getTime() > now.getTime();
            })
          : result.data;
        setSlots(filtered);
      } else {
        setSlots([]);
      }
    });
  }, [bookingDate]);

  function goToStep2() {
    if (!serviceId) {
      setFormError("برجاء اختيار الخدمة");
      return;
    }
    setFormError(null);
    setStep(2);
  }

  function goToStep3() {
    if (!bookingDate || !bookingTime) {
      setFormError("برجاء اختيار التاريخ والوقت");
      return;
    }
    setFormError(null);
    setStep(3);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setErrors({});

    const parsed = bookingFormSchema.safeParse({
      name,
      phone,
      vehicleType,
      serviceId,
      bookingDate,
      bookingTime,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    startSubmitTransition(async () => {
      const result = await createBooking(parsed.data);
      if (result.success) {
        setSuccess(result.data);
      } else {
        setFormError(result.error);
      }
    });
  }

  function reset() {
    setSuccess(null);
    setStep(1);
    setServiceId("");
    setBookingDate("");
    setBookingTime("");
    setSlots(null);
    setName("");
    setPhone("");
    setErrors({});
    setFormError(null);
  }

  if (success) {
    return <BookingSuccess summary={success} onBookAnother={reset} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">احجز موعدك</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-500">
          ثلاث خطوات بسيطة، بدون حساب وبدون انتظار
        </p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((label, index) => {
          const num = index + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done && "bg-brand-600 text-white",
                  active && "bg-brand-600 text-white ring-4 ring-brand-100",
                  !active && !done && "bg-ink-100 text-ink-400",
                )}
              >
                {num}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  active || done ? "text-ink-900" : "text-ink-400",
                )}
              >
                {label}
              </span>
              {num < STEPS.length && <div className="mx-1 h-px w-6 bg-ink-200 sm:w-10" />}
            </div>
          );
        })}
      </div>

      <Card className="p-5 sm:p-8">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="animate-in fade-in-0 slide-in-up space-y-6">
              <div>
                <Label>نوع المركبة</Label>
                <div className="grid grid-cols-2 gap-3">
                  <VehicleOption
                    icon={Car}
                    label="سيارة"
                    active={vehicleType === "car"}
                    onClick={() => setVehicleType("car")}
                  />
                  <VehicleOption
                    icon={Bike}
                    label="موتوسيكل / سكوتر"
                    active={vehicleType === "motorcycle"}
                    onClick={() => setVehicleType("motorcycle")}
                  />
                </div>
              </div>

              <div>
                <Label>اختر الخدمة</Label>
                <div className="space-y-2.5">
                  {services.map((service) => {
                    const price =
                      vehicleType === "car" ? service.car_price : service.motorcycle_price;
                    const active = serviceId === service.id;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setServiceId(service.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border p-4 text-right transition-colors",
                          active
                            ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
                            : "border-ink-200 hover:border-ink-300 hover:bg-ink-50",
                        )}
                      >
                        <div>
                          <p className="font-semibold text-ink-900">{service.name}</p>
                          {service.description && (
                            <p className="mt-0.5 text-xs text-ink-500">{service.description}</p>
                          )}
                        </div>
                        <span className="shrink-0 font-bold text-brand-700">
                          {formatCurrency(price, currency)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <Button type="button" size="lg" className="w-full" onClick={goToStep2}>
                التالي
                <ArrowLeft className="size-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in-0 slide-in-up space-y-6">
              <div>
                <Label>اختر التاريخ</Label>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                  {days.map((day) => {
                    const active = bookingDate === day.key;
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => {
                          setBookingDate(day.key);
                          setBookingTime("");
                        }}
                        className={cn(
                          "flex min-w-16 shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 transition-colors",
                          active
                            ? "border-brand-500 bg-brand-600 text-white"
                            : "border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-ink-50",
                        )}
                      >
                        <span className="text-[11px] opacity-80">{day.weekday}</span>
                        <span className="text-base font-bold">{day.day}</span>
                        <span className="text-[11px] opacity-80">{day.month}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {bookingDate && (
                <div>
                  <Label>اختر الوقت</Label>
                  {slotsPending && (
                    <div className="flex items-center justify-center gap-2 py-8 text-ink-400">
                      <Loader2 className="size-5 animate-spin" />
                      جارِ تحميل المواعيد المتاحة...
                    </div>
                  )}
                  {!slotsPending && slots && slots.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-8 text-center text-ink-400">
                      <CalendarX2 className="size-6" />
                      لا توجد مواعيد متاحة في هذا اليوم، جرّب يومًا آخر
                    </div>
                  )}
                  {!slotsPending && slots && slots.length > 0 && (
                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                      {slots.map((slot) => {
                        const active = bookingTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingTime(slot)}
                            className={cn(
                              "rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors",
                              active
                                ? "border-brand-500 bg-brand-600 text-white"
                                : "border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-ink-50",
                            )}
                          >
                            {formatTime(slot)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                  <ArrowRight className="size-4" />
                  السابق
                </Button>
                <Button type="button" size="lg" className="flex-1" onClick={goToStep3}>
                  التالي
                  <ArrowLeft className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in-0 slide-in-up space-y-5">
              <div>
                <Label htmlFor="name">الاسم بالكامل</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أحمد محمد"
                  autoComplete="name"
                />
                {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  inputMode="numeric"
                  dir="ltr"
                  className="text-right"
                  autoComplete="tel"
                />
                {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="rounded-xl bg-ink-50 p-4 text-sm">
                <p className="mb-2 font-semibold text-ink-800">ملخص الحجز</p>
                <ul className="space-y-1 text-ink-600">
                  <li>الخدمة: {selectedService?.name}</li>
                  <li>نوع المركبة: {vehicleType === "car" ? "سيارة" : "موتوسيكل / سكوتر"}</li>
                  <li>التاريخ والوقت: {bookingDate} — {bookingTime && formatTime(bookingTime)}</li>
                </ul>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={submitPending}
                >
                  <ArrowRight className="size-4" />
                  السابق
                </Button>
                <Button type="submit" size="lg" className="flex-1" loading={submitPending}>
                  تأكيد الحجز
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}

function VehicleOption({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Car;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
        active
          ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
          : "border-ink-200 hover:border-ink-300 hover:bg-ink-50",
      )}
    >
      <Icon className={cn("size-6", active ? "text-brand-600" : "text-ink-400")} />
      <span className={cn("text-sm font-semibold", active ? "text-brand-800" : "text-ink-700")}>
        {label}
      </span>
    </button>
  );
}
