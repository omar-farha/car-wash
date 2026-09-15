import { requireStaff } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";
import { getPendingBookingsCount } from "@/lib/actions/bookings";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, settings, pendingBookingsResult] = await Promise.all([
    requireStaff(),
    getSettings(),
    getPendingBookingsCount(),
  ]);
  const pendingBookingsCount = pendingBookingsResult.success ? pendingBookingsResult.data : 0;

  return (
    <div className="flex min-h-dvh bg-ink-50/40">
      <DashboardSidebar
        businessName={settings.business_name}
        role={profile.role}
        initialPendingBookings={pendingBookingsCount}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          businessName={settings.business_name}
          fullName={profile.full_name}
          role={profile.role}
          initialPendingBookings={pendingBookingsCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
