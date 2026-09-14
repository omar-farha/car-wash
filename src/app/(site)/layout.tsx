import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSettings } from "@/lib/data/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-dvh flex-col bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,var(--color-brand-50),transparent)]">
      <SiteHeader businessName={settings.business_name} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        businessName={settings.business_name}
        phone={settings.phone}
        whatsappNumber={settings.whatsapp_number}
        address={settings.address}
      />
    </div>
  );
}
