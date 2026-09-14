import type { Metadata } from "next";
import { ServicesGrid } from "@/components/site/services-grid";
import { getSettings } from "@/lib/data/settings";
import { getActiveServices } from "@/lib/data/services";

export const metadata: Metadata = { title: "خدماتنا وأسعارنا" };

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([
    getSettings(),
    getActiveServices(),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">
          خدماتنا وأسعارنا
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-500">
          أسعار ثابتة وواضحة لكل خدمة، سواء لسيارتك أو لدراجتك، بدون أي رسوم إضافية
        </p>
      </div>

      <ServicesGrid services={services} currency={settings.currency} />
    </section>
  );
}
