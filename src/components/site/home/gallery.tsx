import Image from "next/image";
import { Reveal } from "@/components/site/home/reveal";
import { galleryPhotos } from "@/lib/stock-photos";

const SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-20 border-t border-ink-100 bg-ink-50/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-10 text-center">
          <p className="text-sm font-bold text-brand-600">من داخل المغسلة</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
            لحظات من شغلنا اليومي
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-2 auto-rows-[140px] gap-2.5 sm:grid-cols-4 sm:auto-rows-[160px] sm:gap-3 lg:auto-rows-[190px]">
            {galleryPhotos.map((photo, index) => (
              <div
                key={photo.src}
                className={`group relative overflow-hidden rounded-2xl ${SPANS[index % SPANS.length]}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
