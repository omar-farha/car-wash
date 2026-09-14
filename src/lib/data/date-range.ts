export type FinanceRange = "today" | "week" | "month" | "last_month" | "year" | "custom";

export interface FinanceFilters {
  range: FinanceRange;
  from?: string;
  to?: string;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date) {
  // Week starts on Saturday (common convention in Egypt).
  const d = startOfDay(date);
  const diff = (d.getDay() + 1) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function getRangeBounds(filters: FinanceFilters): { start: Date; end: Date } {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);

  switch (filters.range) {
    case "today":
      return { start: todayStart, end: tomorrow };
    case "week":
      return { start: startOfWeek(now), end: tomorrow };
    case "month":
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: tomorrow };
    case "last_month":
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 1),
      };
    case "year":
      return { start: new Date(now.getFullYear(), 0, 1), end: tomorrow };
    case "custom": {
      const start = filters.from ? new Date(`${filters.from}T00:00:00`) : todayStart;
      const endBase = filters.to ? new Date(`${filters.to}T00:00:00`) : todayStart;
      const end = new Date(endBase);
      end.setDate(end.getDate() + 1);
      return { start, end };
    }
    default:
      return { start: todayStart, end: tomorrow };
  }
}
