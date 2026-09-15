"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  Users,
  Wrench,
  UserCog,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPendingBookingsCount } from "@/lib/actions/bookings";
import type { UserRole } from "@/types/database";

const POLL_INTERVAL_MS = 45_000;

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  ownerOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "الطلبات", icon: ClipboardList },
  { href: "/dashboard/bookings", label: "الحجوزات", icon: CalendarClock },
  { href: "/dashboard/customers", label: "العملاء", icon: Users },
  { href: "/dashboard/services", label: "الخدمات", icon: Wrench, ownerOnly: true },
  { href: "/dashboard/employees", label: "الموظفين", icon: UserCog, ownerOnly: true },
  { href: "/dashboard/finance", label: "الماليات", icon: Wallet, ownerOnly: true },
  { href: "/dashboard/reports", label: "التقارير", icon: BarChart3, ownerOnly: true },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, ownerOnly: true },
];

export function NavLinks({
  role,
  onNavigate,
  initialPendingBookings = 0,
}: {
  role: UserRole;
  onNavigate?: () => void;
  initialPendingBookings?: number;
}) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.ownerOnly || role === "owner");
  const [pendingBookings, setPendingBookings] = useState(initialPendingBookings);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const result = await getPendingBookingsCount();
      if (result.success) setPendingBookings(result.data);
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        const showBadge = item.href === "/dashboard/bookings" && pendingBookings > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-600 text-white shadow-soft"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
            )}
          >
            <Icon className="size-[18px]" />
            <span className="flex-1">{item.label}</span>
            {showBadge && (
              <span
                className={cn(
                  "flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold",
                  active ? "bg-white text-brand-700" : "bg-brand-600 text-white",
                )}
              >
                {pendingBookings}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
