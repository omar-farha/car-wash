import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "neutral",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "brand" | "success" | "warning";
}) {
  const toneStyles: Record<typeof tone, string> = {
    neutral: "bg-ink-100 text-ink-600",
    brand: "bg-brand-50 text-brand-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
  };

  return (
    <Card className="flex items-center gap-4 p-5">
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          toneStyles[tone],
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-ink-500">{label}</p>
        <p className="mt-0.5 text-xl font-extrabold text-ink-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-ink-400">{hint}</p>}
      </div>
    </Card>
  );
}
