import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
        neutral: "bg-ink-100 text-ink-600 ring-1 ring-ink-200",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        danger: "bg-red-50 text-red-700 ring-1 ring-red-200",
        outline: "border border-ink-200 text-ink-700",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
