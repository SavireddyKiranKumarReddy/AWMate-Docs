import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export const PRIMARY_OWNER_EMAIL = "kiransavireddy@gmail.com";

export type AdminRole = "owner" | "admin" | "member" | "auditor";
export type AccessStatus = "active" | "pending" | "suspended" | "revoked";

export type AdminActor = {
  user: User;
  grant: {
    id: string;
    email: string;
    role: "owner" | "admin";
    status: "active";
  };
  supabase: SupabaseClient;
};

export class AdminAccessError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function requireAdmin(request: Request): Promise<AdminActor> {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new AdminAccessError("Authentication required.", 401);

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) throw new AdminAccessError("Admin service is not configured.", 503);

  const supabase = createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const verified = await supabase.auth.getUser(token);
  if (verified.error || !verified.data.user) {
    throw new AdminAccessError("Your session is invalid or expired.", 401);
  }

  const result = await supabase
    .from("access_grants")
    .select("id,email,role,status,expires_at")
    .eq("user_id", verified.data.user.id)
    .maybeSingle();

  if (result.error) throw new AdminAccessError("Unable to verify administrator access.", 500);
  const grant = result.data;
  const expired = grant?.expires_at && new Date(grant.expires_at).getTime() <= Date.now();
  if (
    !grant ||
    grant.status !== "active" ||
    expired ||
    (grant.role !== "owner" && grant.role !== "admin")
  ) {
    throw new AdminAccessError("Administrator access required.", 403);
  }

  return {
    user: verified.data.user,
    grant: {
      id: grant.id,
      email: grant.email,
      role: grant.role,
      status: grant.status,
    },
    supabase,
  };
}

export function adminErrorResponse(error: unknown) {
  const status = error instanceof AdminAccessError ? error.status : 500;
  const message = error instanceof Error ? error.message : "Unexpected admin service error.";
  return json(
    { error: status === 500 ? "Unable to complete the admin request." : message },
    status,
  );
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
