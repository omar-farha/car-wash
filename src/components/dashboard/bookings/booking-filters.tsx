"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";
import type { BookingStatus } from "@/types/database";

const DATE_OPTIONS = [
  { value: "today", label: "اليوم" },
  { value: "tomorrow", label: "غدًا" },
  { value: "week", label: "هذا الأسبوع" },
  { value: "all", label: "كل التواريخ" },
];

export function BookingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Select
        defaultValue={searchParams.get("date") ?? "all"}
        onValueChange={(v) => updateParam("date", v)}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="التاريخ" />
        </SelectTrigger>
        <SelectContent>
          {DATE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(v) => updateParam("status", v)}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الحالات</SelectItem>
          {(Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {BOOKING_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
