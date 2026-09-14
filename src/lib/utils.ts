import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// "ar-EG" alone renders Eastern Arabic-Indic digits (١٢٣). Egyptian invoices
// and business software conventionally use Western digits with Arabic text,
// so numbering is pinned to "latn" explicitly.
const currencyFormatter = new Intl.NumberFormat("ar-EG-u-nu-latn", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number, currency = "EGP") {
  const label = currency === "EGP" ? "جنيه" : currency;
  return `${currencyFormatter.format(amount)} ${label}`;
}

export function formatNumber(value: number) {
  return currencyFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(date);
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateTimeFormatter.format(date);
}

/** Formats a "HH:mm:ss" or "HH:mm" DB time value as localized Arabic time. */
export function formatTime(value: string) {
  const [h, m] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return timeFormatter.format(date);
}

/** Returns a YYYY-MM-DD string for a Date, in local time (not UTC). */
export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Strips characters that would break a PostgREST `.or()`/`.ilike()` filter
 * string (commas, parentheses, wildcards) before interpolating user input
 * into a raw filter expression.
 */
export function sanitizeSearchTerm(term: string) {
  return term.replace(/[,()%_]/g, " ").trim();
}
