import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone, Wallet, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { OrderStatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { requireStaff } from "@/lib/auth";
import { getCustomerDetail } from "@/lib/data/customers";
import { getSettings } from "@/lib/data/settings";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "بيانات العميل" };

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireStaff();

  const [detail, settings] = await Promise.all([getCustomerDetail(id), getSettings()]);
  if (!detail) notFound();

  const { customer, history, totalPayments } = detail;

  return (
    <div>
      <Link
        href="/dashboard/customers"
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        <ArrowRight className="size-4" />
        العودة للعملاء
      </Link>

      <PageHeader title={customer.name} description="بيانات العميل وتاريخ طلباته" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
            <Phone className="size-4" />
          </span>
          <div>
            <p className="text-xs text-ink-500">رقم الهاتف</p>
            <p dir="ltr" className="text-right font-bold text-ink-900">
              {customer.phone}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Wallet className="size-4" />
          </span>
          <div>
            <p className="text-xs text-ink-500">إجمالي المدفوعات</p>
            <p className="font-bold text-ink-900">
              {formatCurrency(totalPayments, settings.currency)}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ClipboardList className="size-4" />
          </span>
          <div>
            <p className="text-xs text-ink-500">عدد الطلبات</p>
            <p className="font-bold text-ink-900">{history.length}</p>
          </div>
        </Card>
      </div>

      <h2 className="mb-3 text-base font-bold text-ink-900">تاريخ الطلبات</h2>
      {history.length === 0 ? (
        <EmptyState icon={ClipboardList} title="لا توجد طلبات سابقة لهذا العميل" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الخدمة</TableHead>
              <TableHead>المركبة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-ink-900">{order.serviceName}</TableCell>
                <TableCell>{VEHICLE_TYPE_LABELS[order.vehicleType]}</TableCell>
                <TableCell className="font-semibold text-brand-700">
                  {formatCurrency(order.price, settings.currency)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatDateTime(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button asChild variant="outline" className="mt-6">
        <Link href="/dashboard/orders">عرض في صفحة الطلبات</Link>
      </Button>
    </div>
  );
}
