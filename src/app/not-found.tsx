import Link from "next/link";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Droplets className="size-7" />
      </span>
      <div>
        <h1 className="text-3xl font-extrabold text-ink-900">404</h1>
        <p className="mt-2 text-ink-500">عذرًا، الصفحة التي تبحث عنها غير موجودة</p>
      </div>
      <Button asChild size="lg">
        <Link href="/">العودة للرئيسية</Link>
      </Button>
    </div>
  );
}
