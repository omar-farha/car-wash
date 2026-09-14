import { createClient } from "@/lib/supabase/server";
import { toDateKey } from "@/lib/utils";
import { getRangeBounds, type FinanceFilters } from "@/lib/data/date-range";
import type { Database, ExpenseCategory } from "@/types/database";

export type { FinanceRange, FinanceFilters } from "@/lib/data/date-range";

export type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];

export interface FinanceSummary {
  income: number;
  expensesTotal: number;
  netProfit: number;
  expenses: ExpenseRow[];
  expensesByCategory: { category: ExpenseCategory; amount: number }[];
}

export async function getFinanceSummary(filters: FinanceFilters): Promise<FinanceSummary> {
  const supabase = await createClient();
  const { start, end } = getRangeBounds(filters);
  const startKey = toDateKey(start);
  const endKey = toDateKey(new Date(end.getTime() - 1));

  const [{ data: invoices }, { data: expenses }] = await Promise.all([
    supabase
      .from("invoices")
      .select("price")
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString()),
    supabase
      .from("expenses")
      .select("*")
      .gte("expense_date", startKey)
      .lte("expense_date", endKey)
      .order("expense_date", { ascending: false }),
  ]);

  const income = (invoices ?? []).reduce((sum, i) => sum + Number(i.price), 0);
  const expensesTotal = (expenses ?? []).reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryMap = new Map<ExpenseCategory, number>();
  for (const expense of expenses ?? []) {
    categoryMap.set(expense.category, (categoryMap.get(expense.category) ?? 0) + Number(expense.amount));
  }

  return {
    income,
    expensesTotal,
    netProfit: income - expensesTotal,
    expenses: expenses ?? [],
    expensesByCategory: [...categoryMap.entries()].map(([category, amount]) => ({
      category,
      amount,
    })),
  };
}
