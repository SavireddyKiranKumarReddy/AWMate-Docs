import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  AdminAccessError,
  PRIMARY_OWNER_EMAIL,
  adminErrorResponse,
  json,
  requireAdmin,
} from "../../../lib/admin.server";

const role = z.enum(["owner", "admin", "member", "auditor"]);
const status = z.enum(["active", "pending", "suspended", "revoked"]);
const nullableLimit = z.number().int().min(0).nullable();
const grantInput = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),
  role,
  status,
  dailyRequestLimit: nullableLimit,
  monthlyTokenLimit: nullableLimit,
  expiresAt: z.string().datetime().nullable(),
});
const updateInput = grantInput.omit({ email: true }).extend({ id: z.string().uuid() });

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const actor = await requireAdmin(request);
          const [grantsResult, profilesResult, usageResult, authResult] = await Promise.all([
            actor.supabase
              .from("access_grants")
              .select("*")
              .order("created_at", { ascending: false }),
            actor.supabase.from("profiles").select("id,email,display_name,avatar_url,created_at"),
            actor.supabase
              .from("usage_events")
              .select("user_id,requests,input_tokens,output_tokens,cost_micros,occurred_at")
              .gte("occurred_at", monthStart()),
            actor.supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
          ]);

          const error =
            grantsResult.error ?? profilesResult.error ?? usageResult.error ?? authResult.error;
          if (error) throw error;

          const profiles = new Map(
            (profilesResult.data ?? []).map((profile) => [profile.id, profile]),
          );
          const authUsers = new Map((authResult.data.users ?? []).map((user) => [user.id, user]));
          const usage = new Map<string, ReturnType<typeof emptyUsage>>();
          const today = dayStart();

          for (const event of usageResult.data ?? []) {
            if (!event.user_id) continue;
            const summary = usage.get(event.user_id) ?? emptyUsage();
            const tokens = Number(event.input_tokens) + Number(event.output_tokens);
            summary.monthRequests += Number(event.requests);
            summary.monthTokens += tokens;
            summary.monthCostMicros += Number(event.cost_micros);
            if (event.occurred_at >= today) {
              summary.todayRequests += Number(event.requests);
              summary.todayTokens += tokens;
              summary.todayCostMicros += Number(event.cost_micros);
            }
            if (!summary.lastActivity || event.occurred_at > summary.lastActivity) {
              summary.lastActivity = event.occurred_at;
            }
            usage.set(event.user_id, summary);
          }

          return json({
            actor: { email: actor.grant.email, role: actor.grant.role },
            users: (grantsResult.data ?? []).map((grant) => {
              const profile = grant.user_id ? profiles.get(grant.user_id) : undefined;
              const authUser = grant.user_id ? authUsers.get(grant.user_id) : undefined;
              return {
                ...grant,
                display_name: profile?.display_name ?? null,
                avatar_url: profile?.avatar_url ?? null,
                auth_created_at: authUser?.created_at ?? null,
                email_confirmed_at: authUser?.email_confirmed_at ?? null,
                last_sign_in_at: authUser?.last_sign_in_at ?? null,
                usage: grant.user_id ? (usage.get(grant.user_id) ?? emptyUsage()) : emptyUsage(),
              };
            }),
          });
        } catch (error) {
          return adminErrorResponse(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const actor = await requireAdmin(request);
          const parsed = grantInput.safeParse(await request.json());
          if (!parsed.success)
            throw new AdminAccessError(
              parsed.error.issues[0]?.message ?? "Invalid user details.",
              400,
            );
          enforceRolePermission(actor.grant.role, parsed.data.role);

          if (
            parsed.data.email === PRIMARY_OWNER_EMAIL &&
            (parsed.data.role !== "owner" ||
              parsed.data.status !== "active" ||
              parsed.data.expiresAt)
          ) {
            throw new AdminAccessError(
              "The primary owner account must remain an active owner without expiry.",
              409,
            );
          }

          const existing = await actor.supabase
            .from("access_grants")
            .select("id")
            .eq("email", parsed.data.email)
            .maybeSingle();
          if (existing.error) throw existing.error;
          if (existing.data) {
            throw new AdminAccessError(
              "This email is already listed. Edit its existing access record instead.",
              409,
            );
          }

          const result = await actor.supabase
            .from("access_grants")
            .insert({
              email: parsed.data.email,
              role: parsed.data.role,
              status: parsed.data.status,
              daily_request_limit: parsed.data.dailyRequestLimit,
              monthly_token_limit: parsed.data.monthlyTokenLimit,
              expires_at: parsed.data.expiresAt,
              approved_by: actor.user.id,
              approved_at: parsed.data.status === "active" ? new Date().toISOString() : null,
            })
            .select("*")
            .single();
          if (result.error) throw result.error;

          await writeAudit(
            actor,
            "access_grant.created",
            result.data.id,
            result.data.user_id,
            {
              email: result.data.email,
              role: result.data.role,
              status: result.data.status,
            },
            request,
          );
          return json({ user: result.data }, 201);
        } catch (error) {
          return adminErrorResponse(error);
        }
      },
      PATCH: async ({ request }) => {
        try {
          const actor = await requireAdmin(request);
          const parsed = updateInput.safeParse(await request.json());
          if (!parsed.success)
            throw new AdminAccessError(
              parsed.error.issues[0]?.message ?? "Invalid user details.",
              400,
            );

          const existingResult = await actor.supabase
            .from("access_grants")
            .select("*")
            .eq("id", parsed.data.id)
            .single();
          if (existingResult.error) throw new AdminAccessError("Access grant not found.", 404);
          const existing = existingResult.data;
          enforceRolePermission(actor.grant.role, existing.role);
          enforceRolePermission(actor.grant.role, parsed.data.role);
          enforceOwnerProtection(actor.user.id, existing, parsed.data);

          if (
            existing.role === "owner" &&
            (parsed.data.role !== "owner" || parsed.data.status !== "active")
          ) {
            const owners = await actor.supabase
              .from("access_grants")
              .select("id", { count: "exact", head: true })
              .eq("role", "owner")
              .eq("status", "active");
            if (owners.error) throw owners.error;
            if ((owners.count ?? 0) <= 1)
              throw new AdminAccessError("The final active owner cannot be removed.", 409);
          }

          const result = await actor.supabase
            .from("access_grants")
            .update({
              role: parsed.data.role,
              status: parsed.data.status,
              daily_request_limit: parsed.data.dailyRequestLimit,
              monthly_token_limit: parsed.data.monthlyTokenLimit,
              expires_at: parsed.data.expiresAt,
              approved_by: parsed.data.status === "active" ? actor.user.id : existing.approved_by,
              approved_at:
                parsed.data.status === "active"
                  ? (existing.approved_at ?? new Date().toISOString())
                  : existing.approved_at,
            })
            .eq("id", parsed.data.id)
            .select("*")
            .single();
          if (result.error) throw result.error;

          await writeAudit(
            actor,
            "access_grant.updated",
            result.data.id,
            result.data.user_id,
            {
              email: result.data.email,
              before: { role: existing.role, status: existing.status },
              after: { role: result.data.role, status: result.data.status },
            },
            request,
          );
          return json({ user: result.data });
        } catch (error) {
          return adminErrorResponse(error);
        }
      },
    },
  },
});

function enforceRolePermission(actorRole: string, targetRole: string) {
  if (actorRole === "owner") return;
  if (targetRole === "owner" || targetRole === "admin") {
    throw new AdminAccessError("Only an owner can manage owners or administrators.", 403);
  }
}

function enforceOwnerProtection(
  actorID: string,
  existing: { user_id: string | null; email: string; role: string; status: string },
  next: { role: string; status: string; expiresAt: string | null },
) {
  if (
    existing.email === PRIMARY_OWNER_EMAIL &&
    (next.role !== "owner" || next.status !== "active" || next.expiresAt)
  ) {
    throw new AdminAccessError(
      "The primary owner account must remain an active owner without expiry.",
      409,
    );
  }
  if (
    existing.user_id === actorID &&
    existing.role === "owner" &&
    (next.role !== "owner" || next.status !== "active")
  ) {
    throw new AdminAccessError("You cannot remove your own owner access.", 409);
  }
}

async function writeAudit(
  actor: Awaited<ReturnType<typeof requireAdmin>>,
  eventType: string,
  resourceID: string,
  userID: string | null,
  metadata: Record<string, unknown>,
  request: Request,
) {
  const result = await actor.supabase.from("audit_events").insert({
    actor_id: actor.user.id,
    user_id: userID,
    event_type: eventType,
    resource_type: "access_grant",
    resource_id: resourceID,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    metadata,
  });
  if (result.error) throw result.error;
}

function emptyUsage() {
  return {
    todayRequests: 0,
    todayTokens: 0,
    todayCostMicros: 0,
    monthRequests: 0,
    monthTokens: 0,
    monthCostMicros: 0,
    lastActivity: null as string | null,
  };
}

function dayStart() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

function monthStart() {
  const date = new Date();
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)).toISOString();
}
