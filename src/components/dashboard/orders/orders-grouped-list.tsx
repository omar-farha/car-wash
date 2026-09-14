import { toDateKey } from "@/lib/utils";
import { OrderCard } from "@/components/dashboard/orders/order-card";
import type { OrderRow } from "@/lib/data/orders";

const GROUP_ACCENTS = [
  "bg-brand-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
];

function groupLabel(dateKey: string) {
  const today = toDateKey(new Date());
  const tomorrow = toDateKey(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const yesterday = toDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

  if (dateKey === today) return "اليوم";
  if (dateKey === tomorrow) return "غدًا";
  if (dateKey === yesterday) return "أمس";

  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${dateKey}T00:00:00`));
}

export function OrdersGroupedList({
  orders,
  currency,
}: {
  orders: OrderRow[];
  currency: string;
}) {
  const groups = new Map<string, OrderRow[]>();
  for (const order of orders) {
    const key = toDateKey(new Date(order.created_at));
    const list = groups.get(key) ?? [];
    list.push(order);
    groups.set(key, list);
  }

  const sortedKeys = [...groups.keys()].sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="space-y-8">
      {sortedKeys.map((key, index) => {
        const groupOrders = groups.get(key)!;
        const accent = GROUP_ACCENTS[index % GROUP_ACCENTS.length];
        return (
          <section key={key}>
            <div className="mb-3 flex items-center gap-2.5">
              <span className={`size-2.5 shrink-0 rounded-full ${accent}`} />
              <h2 className="text-sm font-bold text-ink-900">{groupLabel(key)}</h2>
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-500">
                {groupOrders.length}
              </span>
              <span className="h-px flex-1 bg-ink-100" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {groupOrders.map((order) => (
                <OrderCard key={order.id} order={order} currency={currency} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
