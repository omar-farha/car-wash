"use client";

import { ExportCsvButton } from "@/components/dashboard/export-csv-button";
import { formatDate } from "@/lib/utils";
import type { CustomerSummary } from "@/lib/data/customers";

const COLUMNS = [
  { header: "الاسم", value: (c: CustomerSummary) => c.name },
  { header: "رقم الهاتف", value: (c: CustomerSummary) => c.phone },
  { header: "عدد الزيارات", value: (c: CustomerSummary) => c.visits },
  { header: "إجمالي المدفوعات", value: (c: CustomerSummary) => c.totalPayments },
  {
    header: "آخر زيارة",
    value: (c: CustomerSummary) => (c.lastVisit ? formatDate(c.lastVisit) : ""),
  },
];

export function ExportCustomersButton({ data }: { data: CustomerSummary[] }) {
  return <ExportCsvButton data={data} columns={COLUMNS} filename="العملاء.csv" />;
}
