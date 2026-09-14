import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/home/reveal";
import { galleryPhotos } from "@/lib/stock-photos";

export function FinalCta({ phone }: { phone?: string | null }) {
  const bg = galleryPhotos[0];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src={bg.src} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink-950/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
      </div>

      <Reveal className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          جاهز تحجز موعدك؟
        </h2>
        <p className="max-w-md text-white/70">
          يستغرق الحجز أقل من دقيقة، بدون حساب وبدون كلمة مرور
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/booking">احجز موعدك الآن</Link>
          </Button>
          {phone && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              <a href={`tel:${phone}`}>
                <PhoneCall className="size-4" />
                اتصل بنا
              </a>
            </Button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
