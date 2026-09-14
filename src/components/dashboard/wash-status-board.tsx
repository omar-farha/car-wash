import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_DOT, ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/types/database";

const BOARD_STATUSES: OrderStatus[] = ["waiting", "washing", "cleaning", "ready"];

export function WashStatusBoard({
  counts,
}: {
  counts: Record<OrderStatus, number>;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="mb-4 text-base font-bold text-ink-900">حالة المغسلة الآن</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BOARD_STATUSES.map((status) => (
          <div
            key={status}
            className="flex flex-col items-center gap-2 rounded-xl bg-ink-50 py-5"
          >
            <span className={cn("size-2.5 rounded-full", ORDER_STATUS_DOT[status])} />
            <span className="text-2xl font-extrabold text-ink-900">{counts[status]}</span>
            <span className="text-xs font-medium text-ink-500">
              {ORDER_STATUS_LABELS[status]}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
