import type { Metadata } from "next";
import Link from "next/link";
import { Users, ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchInput } from "@/components/dashboard/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { requireStaff } from "@/lib/auth";
import { getCustomers } from "@/lib/data/customers";
import { getSettings } from "@/lib/data/settings";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "العملاء" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  await requireStaff();
  const [customers, settings] = await Promise.all([getCustomers(q), getSettings()]);

  return (
    <div>
      <PageHeader title="العملاء" description="كل العملاء الذين تعاملوا مع المغسلة" />

      <div className="mb-5">
        <SearchInput placeholder="ابحث بالاسم أو رقم الهاتف" />
      </div>

      {customers.length === 0 ? (
        <EmptyState icon={Users} title="لا يوجد عملاء" description="لم يتم تسجيل أي عملاء بعد" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>رقم الهاتف</TableHead>
              <TableHead>عدد الزيارات</TableHead>
              <TableHead>إجمالي المدفوعات</TableHead>
              <TableHead>آخر زيارة</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-semibold text-ink-900">{customer.name}</TableCell>
                <TableCell dir="ltr" className="text-right">
                  {customer.phone}
                </TableCell>
                <TableCell>{customer.visits}</TableCell>
                <TableCell className="font-semibold text-brand-700">
                  {formatCurrency(customer.totalPayments, settings.currency)}
                </TableCell>
                <TableCell>
                  {customer.lastVisit ? formatDate(customer.lastVisit) : "—"}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
                  >
                    التفاصيل
                    <ChevronLeft className="size-3.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
