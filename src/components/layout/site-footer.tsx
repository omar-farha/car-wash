import Link from "next/link";
import { Droplets, MapPin, Phone, MessageCircle } from "lucide-react";

interface SiteFooterProps {
  businessName: string;
  phone?: string | null;
  whatsappNumber?: string | null;
  address?: string | null;
}

export function SiteFooter({
  businessName,
  phone,
  whatsappNumber,
  address,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-ink-100 bg-ink-50/60">
      {address && (
        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-ink-100 shadow-soft">
            <iframe
              title="موقع المغسلة على الخريطة"
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full grayscale-[15%] contrast-[1.05] sm:h-96"
            />
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <Droplets className="size-4" />
            </span>
            <p className="text-lg font-extrabold text-ink-900">{businessName}</p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">
            نهتم بسيارتك ودراجتك كأنها سيارتنا، خدمة سريعة ونظافة تدوم.
          </p>
        </div>

        <div className="space-y-2.5 text-sm text-ink-600">
          <p className="mb-1 font-semibold text-ink-900">روابط سريعة</p>
          <Link href="/services" className="block transition-colors hover:text-brand-700">
            خدماتنا
          </Link>
          <Link href="/booking" className="block transition-colors hover:text-brand-700">
            احجز موعدك
          </Link>
          <Link href="/login" className="block transition-colors hover:text-brand-700">
            دخول الموظفين
          </Link>
        </div>

        <div className="space-y-2.5 text-sm text-ink-600">
          <p className="mb-1 font-semibold text-ink-900">تواصل معنا</p>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 transition-colors hover:text-brand-700"
            >
              <Phone className="size-4 shrink-0 text-brand-600" />
              <span dir="ltr">{phone}</span>
            </a>
          )}
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-brand-700"
            >
              <MessageCircle className="size-4 shrink-0 text-brand-600" />
              واتساب
            </a>
          )}
          {address && (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" />
              <span>{address}</span>
            </p>
          )}
          {!phone && !whatsappNumber && !address && (
            <p className="text-ink-400">سيتم إضافة بيانات التواصل قريبًا</p>
          )}
        </div>
      </div>

      <div className="border-t border-ink-100 py-5 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} {businessName} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
