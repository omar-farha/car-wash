"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/types/database";

interface FilterOption {
  id: string;
  label: string;
}

export function OrderFilters({
  employees,
  services,
}: {
  employees: FilterOption[];
  services: FilterOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") updateParam("q", q);
  }

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onBlur={() => updateParam("q", q)}
          placeholder="ابحث بالاسم أو الهاتف أو الخدمة"
          className="pr-10"
        />
      </div>

      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(v) => updateParam("status", v)}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الحالات</SelectItem>
          {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("date") ?? "all"}
        onValueChange={(v) => updateParam("date", v)}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="التاريخ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل التواريخ</SelectItem>
          <SelectItem value="today">اليوم</SelectItem>
        </SelectContent>
      </Select>

      {services.length > 0 && (
        <Select
          defaultValue={searchParams.get("serviceId") ?? "all"}
          onValueChange={(v) => updateParam("serviceId", v)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="الخدمة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الخدمات</SelectItem>
            {services.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {employees.length > 0 && (
        <Select
          defaultValue={searchParams.get("employeeId") ?? "all"}
          onValueChange={(v) => updateParam("employeeId", v)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="الموظف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الموظفين</SelectItem>
            {employees.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
