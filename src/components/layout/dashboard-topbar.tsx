"use client";

import { useState } from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X, Droplets, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NavLinks } from "@/components/layout/dashboard-nav";
import { logout } from "@/lib/actions/auth";
import type { UserRole } from "@/types/database";

const ROLE_LABELS: Record<UserRole, string> = {
  owner: "صاحب المغسلة",
  employee: "موظف",
};

export function DashboardTopbar({
  businessName,
  fullName,
  role,
  initialPendingBookings = 0,
}: {
  businessName: string;
  fullName: string;
  role: UserRole;
  initialPendingBookings?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex size-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100"
          aria-label="فتح القائمة"
        >
          <Menu className="size-5" />
          {initialPendingBookings > 0 && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand-600" />
          )}
        </button>
        <span className="text-sm font-extrabold text-ink-900">{businessName}</span>
      </div>

      <div className="hidden md:block" />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-medium text-ink-700 outline-none hover:bg-ink-100">
          <span className="flex size-8 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
            {fullName.slice(0, 1)}
          </span>
          <span className="hidden text-right sm:block">
            <span className="block leading-tight">{fullName}</span>
            <span className="block text-xs font-normal text-ink-400">{ROLE_LABELS[role]}</span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <User className="size-4" />
              الإعدادات
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onClick={() => logout()}>
            <LogOut className="size-4" />
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-950/40 backdrop-blur-[2px] animate-in fade-in-0" />
          <DialogPrimitive.Content
            dir="rtl"
            className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-pop animate-in fade-in-0 slide-in-up"
          >
            <DialogPrimitive.Title className="sr-only">القائمة</DialogPrimitive.Title>
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
                  <Droplets className="size-5" />
                </span>
                <span className="truncate text-sm font-extrabold text-ink-900">
                  {businessName}
                </span>
              </div>
              <DialogPrimitive.Close className="flex size-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100">
                <X className="size-4" />
              </DialogPrimitive.Close>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">
              <NavLinks
                role={role}
                onNavigate={() => setOpen(false)}
                initialPendingBookings={initialPendingBookings}
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  );
}
