"use client";

import { ExportCsvButton } from "@/components/dashboard/export-csv-button";
import { formatDate } from "@/lib/utils";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import type { ExpenseRow } from "@/lib/data/finance";

const COLUMNS = [
  { header: "الوصف", value: (e: ExpenseRow) => e.description },
  { header: "التصنيف", value: (e: ExpenseRow) => EXPENSE_CATEGORY_LABELS[e.category] },
  { header: "المبلغ", value: (e: ExpenseRow) => e.amount },
  { header: "التاريخ", value: (e: ExpenseRow) => formatDate(e.expense_date) },
];

export function ExportExpensesButton({ data }: { data: ExpenseRow[] }) {
  return <ExportCsvButton data={data} columns={COLUMNS} filename="المصروفات.csv" />;
}
