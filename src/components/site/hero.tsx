import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroPhoto } from "@/lib/stock-photos";

const highlights = [
  { icon: Sparkles, label: "نتائج تلمع من أول مرة" },
  { icon: Clock, label: "خدمة سريعة بلا انتظار" },
  { icon: ShieldCheck, label: "أسعار واضحة بدون مفاجآت" },
];

export function Hero({ businessName }: { businessName: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,var(--color-brand-50),transparent)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="animate-in fade-in-0 slide-in-up text-center lg:text-right">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
            <Sparkles className="size-3.5" />
            حجز فوري بدون انتظار
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] text-ink-900 sm:text-5xl lg:text-[3.4rem]">
            سيارتك تستحق
            <span className="relative mx-2 inline-block text-brand-600">
              لمعة حقيقية
              <svg
                viewBox="0 0 200 12"
                className="absolute -bottom-1.5 left-0 h-2.5 w-full text-brand-200"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 9.5C40 2.5 160 2.5 198 9.5"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
            <br />
            في {businessName}
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-500 sm:text-lg lg:mx-0">
            احجز موعد غسيل سيارتك أو دراجتك في دقيقة واحدة، بدون حساب وبدون
            تعقيد. نظافة احترافية وأسعار واضحة من أول لحظة.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/booking">
                احجز موعدك الآن
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/services">تصفح خدماتنا وأسعارنا</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            {highlights.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-ink-600">
                <span className="flex size-8 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-ink-100">
                  <Icon className="size-4 text-brand-600" />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-in fade-in-0 zoom-in-95 lg:max-w-none">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-100 via-transparent to-transparent blur-2xl" />

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-pop ring-1 ring-black/5 sm:aspect-square lg:aspect-[4/5]">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              priority
              sizes="(min-width: 1024px) 32rem, (min-width: 640px) 28rem, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />

            <div className="absolute right-5 top-5 flex items-center gap-2 rounded-2xl bg-white/90 px-3.5 py-2 backdrop-blur-sm">
              <Sparkles className="size-4 text-brand-600" />
              <span className="text-xs font-bold text-ink-900">جاهزون لخدمتك الآن</span>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-pop ring-1 ring-ink-100 sm:-left-8">
            <div className="flex -space-x-1 space-x-reverse">
              {[Star, Star, Star].map((StarIcon, i) => (
                <StarIcon key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="h-6 w-px bg-ink-100" />
            <div className="text-right">
              <p className="text-xs font-bold text-ink-900">جودة تستحق الثقة</p>
              <p className="text-[11px] text-ink-400">فريق محترف وأدوات حديثة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
