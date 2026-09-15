"use client";

import { ExportCsvButton } from "@/components/dashboard/export-csv-button";
import { formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS, VEHICLE_TYPE_LABELS } from "@/lib/constants";
import type { OrderRow } from "@/lib/data/orders";

const COLUMNS = [
  { header: "رقم الطلب", value: (o: OrderRow) => o.order_number },
  { header: "العميل", value: (o: OrderRow) => o.customer?.name ?? "" },
  { header: "الهاتف", value: (o: OrderRow) => o.customer?.phone ?? "" },
  { header: "الخدمة", value: (o: OrderRow) => o.service_name },
  { header: "المركبة", value: (o: OrderRow) => VEHICLE_TYPE_LABELS[o.vehicle_type] },
  { header: "السعر", value: (o: OrderRow) => o.price },
  { header: "الحالة", value: (o: OrderRow) => ORDER_STATUS_LABELS[o.status] },
  { header: "الموظف", value: (o: OrderRow) => o.employee?.full_name ?? "" },
  { header: "التاريخ", value: (o: OrderRow) => formatDateTime(o.created_at) },
];

export function ExportOrdersButton({ data }: { data: OrderRow[] }) {
  return <ExportCsvButton data={data} columns={COLUMNS} filename="الطلبات.csv" />;
}
