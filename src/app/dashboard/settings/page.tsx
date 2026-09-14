import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsForm } from "@/components/dashboard/settings/settings-form";
import { requireOwner } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "الإعدادات" };

export default async function SettingsPage() {
  await requireOwner();
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title="الإعدادات" description="بيانات المغسلة الأساسية والفاتورة" />
      <div className="max-w-2xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
