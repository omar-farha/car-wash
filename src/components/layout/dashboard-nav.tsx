"use client";

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
import type { UserRole } from "@/types/database";

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
}: {
  role: UserRole;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.ownerOnly || role === "owner");

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
