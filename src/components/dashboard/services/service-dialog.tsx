"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { serviceFormSchema } from "@/lib/validations";
import { createService, updateService } from "@/lib/actions/services";
import type { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];

export function ServiceDialog({ service }: { service?: Service }) {
  const isEdit = !!service;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [carPrice, setCarPrice] = useState(service ? String(service.car_price) : "");
  const [motorcyclePrice, setMotorcyclePrice] = useState(
    service ? String(service.motorcycle_price) : "",
  );
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = serviceFormSchema.safeParse({
      name,
      description,
      carPrice,
      motorcyclePrice,
      isActive,
    });
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
      const result = isEdit
        ? await updateService(service.id, parsed.data)
        : await createService(parsed.data);

      if (result.success) {
        toast.success(isEdit ? "تم تحديث الخدمة" : "تمت إضافة الخدمة");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm">
            <Pencil className="size-4" />
            تعديل
          </Button>
        ) : (
          <Button size="lg">
            <Plus className="size-4" />
            خدمة جديدة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</DialogTitle>
          <DialogDescription>حدد اسم الخدمة والسعر لكل نوع مركبة</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service-name">اسم الخدمة</Label>
            <Input
              id="service-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="غسيل خارجي"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="service-description">الوصف (اختياري)</Label>
            <Textarea
              id="service-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر للخدمة"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="car-price">سعر السيارة (جنيه)</Label>
              <Input
                id="car-price"
                type="number"
                min={0}
                step="0.5"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                dir="ltr"
                className="text-right"
              />
              {errors.carPrice && <p className="mt-1.5 text-sm text-red-600">{errors.carPrice}</p>}
            </div>
            <div>
              <Label htmlFor="moto-price">سعر الموتوسيكل (جنيه)</Label>
              <Input
                id="moto-price"
                type="number"
                min={0}
                step="0.5"
                value={motorcyclePrice}
                onChange={(e) => setMotorcyclePrice(e.target.value)}
                dir="ltr"
                className="text-right"
              />
              {errors.motorcyclePrice && (
                <p className="mt-1.5 text-sm text-red-600">{errors.motorcyclePrice}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
            <Label htmlFor="service-active" className="mb-0">
              الخدمة مفعّلة وتظهر للعملاء
            </Label>
            <Switch id="service-active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <DialogFooter>
            <Button type="submit" size="lg" className="w-full" loading={pending}>
              {isEdit ? "حفظ التعديلات" : "إضافة الخدمة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
