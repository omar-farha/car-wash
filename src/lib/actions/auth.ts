"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginFormSchema } from "@/lib/validations";

type ActionResult = { success: true } | { success: false; error: string };

export async function login(input: unknown): Promise<ActionResult> {
  const parsed = loginFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return { success: false, error: "هذا الحساب غير مسجل في النظام" };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return { success: false, error: "تم تعطيل هذا الحساب، تواصل مع صاحب المغسلة" };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
