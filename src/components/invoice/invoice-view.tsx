"use client";

import Link from "next/link";
import { Printer, ArrowRight, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { VehicleType } from "@/types/database";

export interface InvoiceData {
  invoiceNumber: number;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  vehicleType: VehicleType;
  price: number;
  paymentMethod: string;
}

export function InvoiceView({
  invoice,
  businessName,
  businessPhone,
  businessAddress,
  currency,
  footerText,
}: {
  invoice: InvoiceData;
  businessName: string;
  businessPhone?: string | null;
  businessAddress?: string | null;
  currency: string;
  footerText?: string | null;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="no-print mb-5 flex items-center justify-between">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
        >
          <ArrowRight className="size-4" />
          العودة للطلبات
        </Link>
        <Button onClick={() => window.print()}>
          <Printer className="size-4" />
          طباعة الفاتورة
        </Button>
      </div>

      <Card className="p-6 print:border-none print:shadow-none sm:p-8" id="invoice-card">
        <div className="flex flex-col items-center gap-2 border-b border-dashed border-ink-200 pb-5 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Droplets className="size-5" />
          </span>
          <h1 className="text-lg font-extrabold text-ink-900">{businessName}</h1>
          {businessAddress && <p className="text-xs text-ink-400">{businessAddress}</p>}
          {businessPhone && (
            <p dir="ltr" className="text-xs text-ink-400">
              {businessPhone}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between py-5">
          <div>
            <p className="text-xs text-ink-400">رقم الفاتورة</p>
            <p className="font-bold text-ink-900">#{invoice.invoiceNumber}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-ink-400">التاريخ والوقت</p>
            <p className="font-medium text-ink-700">{formatDateTime(invoice.createdAt)}</p>
          </div>
        </div>

        <div className="space-y-1.5 rounded-xl bg-ink-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-500">العميل</span>
            <span className="font-semibold text-ink-900">{invoice.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">الهاتف</span>
            <span dir="ltr" className="font-semibold text-ink-900">
              {invoice.customerPhone}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex items-center justify-between border-b border-ink-100 py-2.5">
            <span className="text-ink-600">الخدمة</span>
            <span className="font-medium text-ink-900">{invoice.serviceName}</span>
          </div>
          <div className="flex items-center justify-between border-b border-ink-100 py-2.5">
            <span className="text-ink-600">المركبة</span>
            <span className="font-medium text-ink-900">
              {VEHICLE_TYPE_LABELS[invoice.vehicleType]}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-ink-100 py-2.5">
            <span className="text-ink-600">طريقة الدفع</span>
            <span className="font-medium text-ink-900">
              {invoice.paymentMethod === "cash" ? "كاش" : invoice.paymentMethod}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-brand-600 px-5 py-4 text-white">
          <span className="font-semibold">الإجمالي</span>
          <span className="text-xl font-extrabold">
            {formatCurrency(invoice.price, currency)}
          </span>
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">
          {footerText || "شكرًا لثقتكم بنا"}
        </p>
      </Card>
    </div>
  );
}
