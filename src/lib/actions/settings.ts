"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireOwner } from "@/lib/auth";
import { settingsFormSchema } from "@/lib/validations";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateSettings(input: unknown): Promise<ActionResult> {
  await requireOwner();
  const parsed = settingsFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const v = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("settings")
    .update({
      business_name: v.businessName,
      whatsapp_number: v.whatsappNumber || null,
      phone: v.phone || null,
      address: v.address || null,
      currency: v.currency,
      invoice_footer_text: v.invoiceFooterText || null,
    })
    .eq("id", 1);

  if (error) return { success: false, error: "تعذر حفظ الإعدادات" };

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/dashboard", "layout");
  return { success: true, data: undefined };
}
