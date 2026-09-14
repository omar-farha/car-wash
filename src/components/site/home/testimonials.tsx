import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/site/home/reveal";

const TESTIMONIALS = [
  {
    name: "أحمد فتحي",
    role: "عميل دائم — سيارة",
    quote:
      "بحجز أونلاين وأوصل ألاقي دوري جاهز، من غير ما أستنى دقيقة. السيارة بترجع نضيفة من جوه وبرّه فعلاً مش بس من بره.",
  },
  {
    name: "مريم الشناوي",
    role: "عميلة — موتوسيكل",
    quote:
      "أول مغسلة بتاخد الموتوسيكلات بجدية زي السيارات بالظبط. الأسعار مكتوبة قدامي قبل ما أحجز، مفيش أي مفاجآت وقت الدفع.",
  },
  {
    name: "كريم عبد الوهاب",
    role: "عميل دائم — سيارة",
    quote:
      "بجيب العربية كل أسبوعين وبلاقي نفس المستوى بالظبط في كل مرة. الفاتورة واضحة والدفع كاش بسيط من غير تعقيد.",
  },
  {
    name: "نورهان جمال",
    role: "عميلة — سيارة",
    quote:
      "كنت بستنى نص ساعة في أماكن تانية عشان بس أغسل العربية. هنا الحجز والتنفيذ سريع جدًا، وفريق الشغل محترم ودمه خفيف.",
  },
  {
    name: "عمرو سليم",
    role: "عميل — سيارة وموتوسيكل",
    quote:
      "بغسل عربيتي وموتوسيكلي في نفس الزيارة، والأسعار فعلاً زي ما هي مكتوبة على الموقع بالظبط. تعامل محترف من أول لحظة.",
  },
];

const AVATAR_COLORS = [
  "bg-brand-100 text-brand-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
];

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20 border-t border-ink-100 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-10 text-center">
          <p className="text-sm font-bold text-brand-600">آراء عملائنا</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
            كلام حقيقي من ناس بتغسل عربيتها عندنا
          </h2>
        </Reveal>
      </div>

      <Reveal delay={100}>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-6">
          {TESTIMONIALS.map((t, index) => (
            <figure
              key={t.name}
              className="relative flex w-75 shrink-0 snap-start flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:w-85"
            >
              <Quote className="size-7 text-brand-200" />
              <blockquote className="flex-1 text-sm leading-relaxed text-ink-700">
                {t.quote}
              </blockquote>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <figcaption className="flex items-center gap-3 border-t border-ink-100 pt-4">
                <span
                  className={`flex size-10 items-center justify-center rounded-full text-sm font-bold ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
                >
                  {t.name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
