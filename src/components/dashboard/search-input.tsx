"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput({
  placeholder,
  paramKey = "q",
}: {
  placeholder: string;
  paramKey?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramKey) ?? "");

  function commit() {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(paramKey, value);
    else params.delete(paramKey);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative max-w-xs flex-1">
      <Search className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        onBlur={commit}
        placeholder={placeholder}
        className="pr-10"
      />
    </div>
  );
}
