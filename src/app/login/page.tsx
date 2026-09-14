import type { Metadata } from "next";
import Link from "next/link";
import { Droplets } from "lucide-react";
import { LoginForm } from "@/components/site/login-form";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default async function LoginPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <Droplets className="size-5" />
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-extrabold text-ink-900">
            {settings.business_name}
          </h1>
          <p className="mt-1 text-sm text-ink-500">تسجيل دخول الموظفين وصاحب المغسلة</p>
        </div>

        <LoginForm />

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-ink-400 transition-colors hover:text-brand-700"
        >
          العودة للموقع الرئيسي
        </Link>
      </div>
    </div>
  );
}
