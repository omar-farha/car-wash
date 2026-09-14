"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";
import { expenseFormSchema } from "@/lib/validations";
import { createExpense } from "@/lib/actions/expenses";
import { toDateKey } from "@/lib/utils";
import type { ExpenseCategory } from "@/types/database";

export function ExpenseDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("other");
  const [expenseDate, setExpenseDate] = useState(toDateKey(new Date()));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function reset() {
    setDescription("");
    setAmount("");
    setCategory("other");
    setExpenseDate(toDateKey(new Date()));
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = expenseFormSchema.safeParse({ description, amount, category, expenseDate });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = await createExpense(parsed.data);
      if (result.success) {
        toast.success("تمت إضافة المصروف");
        setOpen(false);
        reset();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="size-4" />
          مصروف جديد
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مصروف</DialogTitle>
          <DialogDescription>سجّل مصروفًا جديدًا لتحديث صافي الربح</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="exp-desc">الوصف</Label>
            <Input
              id="exp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="فاتورة كهرباء"
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="exp-amount">المبلغ (جنيه)</Label>
              <Input
                id="exp-amount"
                type="number"
                min={0}
                step="0.5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                dir="ltr"
                className="text-right"
              />
              {errors.amount && <p className="mt-1.5 text-sm text-red-600">{errors.amount}</p>}
            </div>
            <div>
              <Label htmlFor="exp-date">التاريخ</Label>
              <Input
                id="exp-date"
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>التصنيف</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {EXPENSE_CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" size="lg" className="w-full" loading={pending}>
              إضافة المصروف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
