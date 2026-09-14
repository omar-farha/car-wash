import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceDialog } from "@/components/dashboard/services/service-dialog";
import { DeleteServiceButton } from "@/components/dashboard/services/delete-service-button";
import { requireOwner } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "الخدمات والأسعار" };

export default async function ServicesPage() {
  await requireOwner();
  const supabase = await createClient();
  const [settings, { data: services }] = await Promise.all([
    getSettings(),
    supabase.from("services").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <PageHeader
        title="الخدمات والأسعار"
        description="تحكم كامل في خدمات المغسلة وأسعارها"
        action={<ServiceDialog />}
      />

      {!services || services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="لا توجد خدمات بعد"
          description="أضف أول خدمة ليظهر السعر للعملاء"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-ink-900">{service.name}</h3>
                <Badge variant={service.is_active ? "success" : "neutral"}>
                  {service.is_active ? "مفعّلة" : "معطّلة"}
                </Badge>
              </div>
              {service.description && (
                <p className="text-sm text-ink-500">{service.description}</p>
              )}
              <div className="space-y-1.5 border-t border-ink-100 pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500">سيارة</span>
                  <span className="font-semibold text-ink-900">
                    {formatCurrency(service.car_price, settings.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">موتوسيكل / سكوتر</span>
                  <span className="font-semibold text-ink-900">
                    {formatCurrency(service.motorcycle_price, settings.currency)}
                  </span>
                </div>
              </div>
              <div className="mt-1 flex gap-2 border-t border-ink-100 pt-3">
                <ServiceDialog service={service} />
                <DeleteServiceButton serviceId={service.id} serviceName={service.name} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
