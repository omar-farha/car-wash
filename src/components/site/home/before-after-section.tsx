import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/site/home/reveal";
import { BeforeAfterSlider } from "@/components/site/home/before-after-slider";

export function BeforeAfterSection() {
  return (
    <section id="before-after" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 text-center lg:order-1 lg:text-right">
          <p className="text-sm font-bold text-brand-600">الفرق واضح</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
            من الغبار للمعان
            <br />
            في نفس الزيارة
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-500 lg:mx-0">
            حرّك المؤشر يمينًا ويسارًا لتشوف بعينك الفرق بين سيارة قبل الغسيل
            وبعده. نفس العناية والاهتمام بكل سيارة تدخل المغسلة.
          </p>
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 lg:mx-0">
            <Sparkles className="size-4" />
            اسحب المؤشر للمقارنة
          </div>
        </Reveal>

        <Reveal delay={120} className="order-1 lg:order-2">
          <BeforeAfterSlider />
        </Reveal>
      </div>
    </section>
  );
}
