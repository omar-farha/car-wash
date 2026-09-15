import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { ServicesGrid } from "@/components/site/services-grid";
import { Reveal } from "@/components/site/home/reveal";
import { BeforeAfterSection } from "@/components/site/home/before-after-section";
import { Gallery } from "@/components/site/home/gallery";
import { Testimonials } from "@/components/site/home/testimonials";
import { TrackSection } from "@/components/site/home/track-section";
import { FinalCta } from "@/components/site/home/final-cta";
import { getSettings } from "@/lib/data/settings";
import { getActiveServices } from "@/lib/data/services";

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    getSettings(),
    getActiveServices(),
  ]);

  return (
    <>
      <Hero businessName={settings.business_name} />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-brand-600">خدماتنا</p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
              كل اللي سيارتك محتاجاه
            </h2>
          </div>
          <Link
            href="/services"
            className="group flex items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-700"
          >
            كل الخدمات والأسعار
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <ServicesGrid services={services} currency={settings.currency} />
        </Reveal>
      </section>

      <BeforeAfterSection />
      <Gallery />
      <Testimonials />
      <TrackSection />
      <FinalCta phone={settings.phone} />
    </>
  );
}
