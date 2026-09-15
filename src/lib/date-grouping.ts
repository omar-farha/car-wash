import { toDateKey } from "@/lib/utils";

export const DATE_GROUP_ACCENTS = [
  "bg-brand-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
];

/** "اليوم" / "غدًا" / "أمس" for adjacent days, else a full weekday + date label. */
export function dateGroupLabel(dateKey: string) {
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
