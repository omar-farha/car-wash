"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireOwner } from "@/lib/auth";
import { serviceFormSchema } from "@/lib/validations";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createService(input: unknown): Promise<ActionResult> {
  await requireOwner();
  const parsed = serviceFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const v = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("services").insert({
    name: v.name,
    description: v.description || null,
    car_price: v.carPrice,
    motorcycle_price: v.motorcyclePrice,
    is_active: v.isActive,
  });

  if (error) return { success: false, error: "تعذر إضافة الخدمة" };

  revalidatePath("/dashboard/services");
  revalidatePath("/");
  revalidatePath("/services");
  return { success: true, data: undefined };
}

export async function updateService(
  serviceId: string,
  input: unknown,
): Promise<ActionResult> {
  await requireOwner();
  const parsed = serviceFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const v = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .update({
      name: v.name,
      description: v.description || null,
      car_price: v.carPrice,
      motorcycle_price: v.motorcyclePrice,
      is_active: v.isActive,
    })
    .eq("id", serviceId);

  if (error) return { success: false, error: "تعذر تحديث الخدمة" };

  revalidatePath("/dashboard/services");
  revalidatePath("/");
  revalidatePath("/services");
  return { success: true, data: undefined };
}

export async function deleteService(serviceId: string): Promise<ActionResult> {
  await requireOwner();
  const supabase = await createClient();

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("service_id", serviceId);

  if (count && count > 0) {
    const { error } = await supabase
      .from("services")
      .update({ is_active: false })
      .eq("id", serviceId);
    if (error) return { success: false, error: "تعذر تعطيل الخدمة" };
    revalidatePath("/dashboard/services");
    revalidatePath("/");
    return { success: true, data: undefined };
  }

  const { error } = await supabase.from("services").delete().eq("id", serviceId);
  if (error) return { success: false, error: "تعذر حذف الخدمة" };

  revalidatePath("/dashboard/services");
  revalidatePath("/");
  return { success: true, data: undefined };
}
