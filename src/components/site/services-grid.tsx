import Link from "next/link";
import { Car, Bike, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import type { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];

export function ServicesGrid({
  services,
  currency = "EGP",
  showBookCta = true,
}: {
  services: Service[];
  currency?: string;
  showBookCta?: boolean;
}) {
  if (services.length === 0) {
    return (
      <EmptyState
        icon={Car}
        title="لا توجد خدمات متاحة حاليًا"
        description="برجاء التواصل معنا أو المحاولة لاحقًا"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card
          key={service.id}
          className="flex flex-col gap-4 p-6 transition-shadow hover:shadow-pop"
        >
          <div>
            <h3 className="text-lg font-bold text-ink-900">{service.name}</h3>
            {service.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                {service.description}
              </p>
            )}
          </div>

          <div className="mt-auto space-y-2.5 border-t border-ink-100 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink-600">
                <Car className="size-4 text-brand-600" />
                سيارة
              </span>
              <span className="font-bold text-ink-900">
                {formatCurrency(service.car_price, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink-600">
                <Bike className="size-4 text-brand-600" />
                موتوسيكل / سكوتر
              </span>
              <span className="font-bold text-ink-900">
                {formatCurrency(service.motorcycle_price, currency)}
              </span>
            </div>
          </div>

          {showBookCta && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/booking?service=${service.id}`}>
                احجز هذه الخدمة
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}
