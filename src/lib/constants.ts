import type {
  BookingStatus,
  ExpenseCategory,
  OrderStatus,
  VehicleType,
} from "@/types/database";

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: "سيارة",
  motorcycle: "موتوسيكل / سكوتر",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  arrived: "تم الوصول",
  in_service: "جاري الخدمة",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export const BOOKING_STATUS_ORDER: BookingStatus[] = [
  "pending",
  "arrived",
  "in_service",
  "completed",
  "cancelled",
];

// Tailwind classes per status — soft background + readable foreground.
export const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  arrived: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  in_service: "bg-red-50 text-red-700 ring-1 ring-red-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  waiting: "في الانتظار",
  washing: "غسيل",
  cleaning: "تنظيف",
  ready: "جاهز",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export const ORDER_WORKFLOW: OrderStatus[] = [
  "waiting",
  "washing",
  "cleaning",
  "ready",
  "completed",
];

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  waiting: "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200",
  washing: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  cleaning: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  ready: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200",
};

export const ORDER_STATUS_DOT: Record<OrderStatus, string> = {
  waiting: "bg-neutral-400",
  washing: "bg-sky-500",
  cleaning: "bg-violet-500",
  ready: "bg-amber-500",
  completed: "bg-emerald-500",
  cancelled: "bg-neutral-400",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  supplies: "مستلزمات",
  salaries: "رواتب",
  utilities: "مرافق",
  maintenance: "صيانة",
  rent: "إيجار",
  other: "أخرى",
};

export const WORKING_HOURS = {
  start: "09:00",
  end: "21:00",
  slotMinutes: 30,
};

export const DEFAULT_BUSINESS_NAME = "مغسلة السيارات";
