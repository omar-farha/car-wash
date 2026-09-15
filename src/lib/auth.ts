import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Returns the signed-in user's profile, or null if not authenticated.
 * Cached per-request — both the dashboard layout and every page under it
 * call this, and without caching each call re-hits Supabase Auth + the
 * profiles table, roughly doubling load time on every navigation.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
});

/** Requires any authenticated, active staff member (owner or employee). */
export async function requireStaff(): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile || !profile.is_active) {
    redirect("/login");
  }

  return profile;
}

/** Requires the owner role. Employees are redirected to the dashboard home. */
export async function requireOwner(): Promise<Profile> {
  const profile = await requireStaff();

  if (profile.role !== "owner") {
    redirect("/dashboard");
  }

  return profile;
}
