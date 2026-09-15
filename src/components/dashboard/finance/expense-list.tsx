"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import { deleteExpense } from "@/lib/actions/expenses";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ExpenseRow } from "@/lib/data/finance";

export function ExpenseList({ expenses, currency }: { expenses: ExpenseRow[]; currency: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteExpense(id);
      if (result.success) {
        toast.success("تم حذف المصروف");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  if (expenses.length === 0) {
    return <EmptyState icon={Receipt} title="لا توجد مصروفات في هذه الفترة" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الوصف</TableHead>
          <TableHead>التصنيف</TableHead>
          <TableHead>المبلغ</TableHead>
          <TableHead>التاريخ</TableHead>
          <TableHead className="no-print" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium text-ink-900">{expense.description}</TableCell>
            <TableCell>
              <Badge variant="outline">{EXPENSE_CATEGORY_LABELS[expense.category]}</Badge>
            </TableCell>
            <TableCell className="font-semibold text-red-600">
              -{formatCurrency(expense.amount, currency)}
            </TableCell>
            <TableCell>{formatDate(expense.expense_date)}</TableCell>
            <TableCell className="no-print">
              <Button
                variant="ghost"
                size="icon"
                disabled={pending}
                onClick={() => handleDelete(expense.id)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
