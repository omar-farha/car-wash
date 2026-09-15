export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

function escapeCsvCell(value: string | number): string {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCsvCell(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCsvCell(c.value(row))).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

/** Triggers a browser download of CSV content. UTF-8 BOM keeps Arabic text readable in Excel. */
export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
