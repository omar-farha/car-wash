import Link from "next/link";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader({ businessName }: { businessName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Droplets className="size-5" />
          </span>
          <span className="text-base font-extrabold text-ink-900 sm:text-lg">
            {businessName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
          >
            الرئيسية
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
          >
            خدماتنا
          </Link>
          <Link
            href="/#before-after"
            className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
          >
            قبل وبعد
          </Link>
          <Link
            href="/#gallery"
            className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
          >
            معرض الصور
          </Link>
          <Link
            href="/#track"
            className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
          >
            تتبع حجزي
          </Link>
        </nav>

        <Button asChild size="sm" className="sm:h-11 sm:px-6">
          <Link href="/booking">احجز موعدك</Link>
        </Button>
      </div>
    </header>
  );
}
