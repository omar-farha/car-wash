"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireOwner } from "@/lib/auth";
import { expenseFormSchema } from "@/lib/validations";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createExpense(input: unknown): Promise<ActionResult> {
  const profile = await requireOwner();
  const parsed = expenseFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const v = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("expenses").insert({
    description: v.description,
    amount: v.amount,
    category: v.category,
    expense_date: v.expenseDate,
    created_by: profile.id,
  });

  if (error) return { success: false, error: "تعذر إضافة المصروف" };

  revalidatePath("/dashboard/finance");
  revalidatePath("/dashboard/reports");
  return { success: true, data: undefined };
}

export async function deleteExpense(expenseId: string): Promise<ActionResult> {
  await requireOwner();
  const supabase = await createClient();

  const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
  if (error) return { success: false, error: "تعذر حذف المصروف" };

  revalidatePath("/dashboard/finance");
  revalidatePath("/dashboard/reports");
  return { success: true, data: undefined };
}
