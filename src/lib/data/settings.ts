import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_BUSINESS_NAME } from "@/lib/constants";

export const getSettings = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();

  return (
    data ?? {
      id: 1 as const,
      business_name: DEFAULT_BUSINESS_NAME,
      whatsapp_number: null,
      phone: null,
      address: null,
      currency: "EGP",
      invoice_footer_text: null,
      updated_at: new Date().toISOString(),
    }
  );
});
