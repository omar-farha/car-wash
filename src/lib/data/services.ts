import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getActiveServices = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("car_price", { ascending: true });

  return data ?? [];
});
