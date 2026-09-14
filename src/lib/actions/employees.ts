"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireOwner } from "@/lib/auth";
import { employeeFormSchema } from "@/lib/validations";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createEmployee(input: unknown): Promise<ActionResult> {
  await requireOwner();
  const parsed = employeeFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const v = parsed.data;
  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: v.email,
    password: v.password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    const message =
      createError?.code === "email_exists"
        ? "هذا البريد الإلكتروني مستخدم بالفعل"
        : "تعذر إنشاء حساب الموظف";
    return { success: false, error: message };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    full_name: v.fullName,
    role: "employee",
    phone: v.phone || null,
    is_active: true,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { success: false, error: "تعذر حفظ بيانات الموظف" };
  }

  revalidatePath("/dashboard/employees");
  return { success: true, data: undefined };
}

export async function setEmployeeActive(
  employeeId: string,
  isActive: boolean,
): Promise<ActionResult> {
  await requireOwner();
  const supabase = await createClient();

  const { data: target } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", employeeId)
    .maybeSingle();

  if (!target || target.role !== "employee") {
    return { success: false, error: "لا يمكن تعديل هذا الحساب" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", employeeId);

  if (error) return { success: false, error: "تعذر تحديث حالة الموظف" };

  revalidatePath("/dashboard/employees");
  return { success: true, data: undefined };
}

export async function deleteEmployee(employeeId: string): Promise<ActionResult> {
  await requireOwner();
  const admin = createAdminClient();

  const { data: target } = await admin
    .from("profiles")
    .select("role")
    .eq("id", employeeId)
    .maybeSingle();

  if (!target || target.role !== "employee") {
    return { success: false, error: "لا يمكن حذف هذا الحساب" };
  }

  await admin.from("profiles").delete().eq("id", employeeId);
  await admin.auth.admin.deleteUser(employeeId);

  revalidatePath("/dashboard/employees");
  return { success: true, data: undefined };
}
