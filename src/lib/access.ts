import type { User } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

export type AccessGrant = {
  id: string;
  user_id: string | null;
  email: string;
  role: "owner" | "admin" | "member" | "auditor";
  status: "active" | "pending" | "suspended" | "revoked";
  daily_request_limit: number | null;
  monthly_token_limit: number | null;
  approved_at: string | null;
  expires_at: string | null;
};

export function hasActiveAccess(grant: AccessGrant | null) {
  if (!grant || grant.status !== "active") return false;
  if (!grant.expires_at) return true;
  return new Date(grant.expires_at).getTime() > Date.now();
}

export async function getAccessGrant(user: User) {
  const result = await getSupabase()
    .from("access_grants")
    .select(
      "id,user_id,email,role,status,daily_request_limit,monthly_token_limit,approved_at,expires_at",
    )
    .eq("user_id", user.id)
    .maybeSingle<AccessGrant>();

  if (result.error) throw result.error;
  return result.data;
}
