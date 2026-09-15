"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Car, Bike, Phone, User, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/dashboard/status-badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { updateOrderStatus, completeOrder } from "@/lib/actions/orders";
import type { OrderRow } from "@/lib/data/orders";

export function OrderCard({ order, currency }: { order: OrderRow; currency: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const VehicleIcon = order.vehicle_type === "car" ? Car : Bike;

  const isTerminal = order.status === "completed" || order.status === "cancelled";

  function handleComplete() {
    startTransition(async () => {
      const result = await completeOrder(order.id);
      if (result.success) {
        toast.success("تم إتمام الطلب وإنشاء الفاتورة");
        router.push(`/dashboard/invoices/${result.data.invoiceId}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, "cancelled");
      if (result.success) {
        toast.success("تم إلغاء الطلب");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
              <VehicleIcon className="size-4" />
            </span>
            <div>
              <p className="flex items-center gap-1.5 font-semibold text-ink-900">
                <User className="size-3.5 text-ink-400" />
                {order.customer?.name ?? "عميل"}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-ink-500" dir="ltr">
                <Phone className="size-3 text-ink-400" />
                {order.customer?.phone}
              </p>
            </div>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-3.5 text-sm">
        <div>
          <p className="font-medium text-ink-800">{order.service_name}</p>
          <p className="mt-0.5 text-xs text-ink-400">
            #{order.order_number} · {formatDateTime(order.created_at)}
            {order.employee && ` · ${order.employee.full_name}`}
          </p>
        </div>
        <p className="text-base font-bold text-brand-700">
          {formatCurrency(order.price, currency)}
        </p>
      </div>

      {!isTerminal && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={handleComplete} loading={pending} className="flex-1 sm:flex-none">
            <CheckCircle2 className="size-4" />
            إتمام الطلب
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={pending}>
                <XCircle className="size-4" />
                إلغاء
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>إلغاء الطلب؟</AlertDialogTitle>
                <AlertDialogDescription>
                  سيتم إلغاء هذا الطلب ولن يمكن التراجع عن ذلك.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>تراجع</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>تأكيد الإلغاء</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {pending && <Loader2 className="size-4 animate-spin self-center text-ink-400" />}
        </div>
      )}

      {order.status === "completed" && order.invoiceId && (
        <Button
          size="sm"
          variant="ghost"
          className="mt-3"
          onClick={() => router.push(`/dashboard/invoices/${order.invoiceId}`)}
        >
          عرض الفاتورة
        </Button>
      )}
    </Card>
  );
}
