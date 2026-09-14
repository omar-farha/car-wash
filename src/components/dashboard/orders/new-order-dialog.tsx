"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Car, Bike } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn, formatCurrency } from "@/lib/utils";
import { createWalkInOrder } from "@/lib/actions/orders";
import { walkInOrderSchema } from "@/lib/validations";
import type { Database, VehicleType } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];

export function NewOrderDialog({
  services,
  currency,
}: {
  services: Service[];
  currency: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [serviceId, setServiceId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function resetForm() {
    setName("");
    setPhone("");
    setVehicleType("car");
    setServiceId("");
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = walkInOrderSchema.safeParse({ name, phone, vehicleType, serviceId });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = await createWalkInOrder(parsed.data);
      if (result.success) {
        toast.success("تم إنشاء الطلب بنجاح");
        setOpen(false);
        resetForm();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="size-4" />
          طلب جديد
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إنشاء طلب جديد</DialogTitle>
          <DialogDescription>لعميل حضر مباشرة بدون حجز مسبق</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-order-name">اسم العميل</Label>
            <Input
              id="new-order-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أحمد محمد"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="new-order-phone">رقم الهاتف</Label>
            <Input
              id="new-order-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              dir="ltr"
              className="text-right"
              inputMode="numeric"
            />
            {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <Label>نوع المركبة</Label>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { value: "car", label: "سيارة", icon: Car },
                  { value: "motorcycle", label: "موتوسيكل / سكوتر", icon: Bike },
                ] as const
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVehicleType(value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors",
                    vehicleType === value
                      ? "border-brand-500 bg-brand-50/60 text-brand-800 ring-1 ring-brand-500"
                      : "border-ink-200 text-ink-600 hover:bg-ink-50",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>الخدمة</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {services.map((service) => {
                const price = vehicleType === "car" ? service.car_price : service.motorcycle_price;
                const active = serviceId === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setServiceId(service.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-right text-sm transition-colors",
                      active
                        ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
                        : "border-ink-200 hover:bg-ink-50",
                    )}
                  >
                    <span className="font-medium text-ink-800">{service.name}</span>
                    <span className="font-bold text-brand-700">
                      {formatCurrency(price, currency)}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.serviceId && (
              <p className="mt-1.5 text-sm text-red-600">{errors.serviceId}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" size="lg" className="w-full" loading={pending}>
              إنشاء الطلب
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
