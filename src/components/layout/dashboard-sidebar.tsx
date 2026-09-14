import Link from "next/link";
import { Droplets } from "lucide-react";
import { NavLinks } from "@/components/layout/dashboard-nav";
import type { UserRole } from "@/types/database";

export function DashboardSidebar({
  businessName,
  role,
}: {
  businessName: string;
  role: UserRole;
}) {
  return (
    <aside className="no-print hidden w-64 shrink-0 border-l border-ink-100 bg-white md:flex md:flex-col">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
          <Droplets className="size-5" />
        </span>
        <span className="truncate text-sm font-extrabold text-ink-900">{businessName}</span>
      </Link>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <NavLinks role={role} />
      </div>

      <div className="border-t border-ink-100 px-5 py-4 text-center text-xs text-ink-400">
        نظام إدارة المغسلة
      </div>
    </aside>
  );
}
