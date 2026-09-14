// Curated real photography for the public home page (Unsplash License — free
// for commercial use). Keep this list small and purposeful.

function unsplash(id: string, params = "w=1600&q=80") {
  return `https://images.unsplash.com/photo-${id}?${params}&auto=format&fit=crop&ixlib=rb-4.1.0`;
}

export const heroPhoto = {
  src: unsplash("1781890424630-ea9e1f931f08", "w=1400&q=85"),
  alt: "سيارة مغطاة برغوة الغسيل البيضاء أثناء عملية الغسيل الاحترافي",
};

export const galleryPhotos = [
  {
    src: unsplash("1750492960810-666661eb8897"),
    alt: "غسيل سيارة يدويًا بعناية فائقة",
  },
  {
    src: unsplash("1605437241278-c1806d14a4d9"),
    alt: "تنظيف احترافي لتابلوه ومقصورة السيارة من الداخل",
  },
  {
    src: unsplash("1536796423601-e9733a86d257"),
    alt: "سيارة نظيفة تمامًا بعد الغسيل الخارجي",
  },
  {
    src: unsplash("1732357624591-f2137085659b"),
    alt: "تلميع تفاصيل السيارة بقطعة قماش مخصصة",
  },
  {
    src: unsplash("1505761283622-7fe50142c97f"),
    alt: "سيارة في محطة الغسيل جاهزة للاستلام",
  },
  {
    src: unsplash("1481760985505-dfd363d0ea33"),
    alt: "واجهة مغسلة سيارات احترافية",
  },
] as const;

export const beforeAfterPhoto = {
  src: unsplash("1694678505383-676d78ea3b96", "w=1400&q=85"),
  alt: "قبل وبعد الغسيل الاحترافي للسيارة",
};
