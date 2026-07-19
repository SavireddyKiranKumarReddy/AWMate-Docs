import { createFileRoute } from "@tanstack/react-router";
import { adminErrorResponse, json, requireAdmin } from "../../../lib/admin.server";

export const Route = createFileRoute("/api/admin/audit")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const actor = await requireAdmin(request);
          const [eventsResult, profilesResult, grantsResult] = await Promise.all([
            actor.supabase
              .from("audit_events")
              .select("*")
              .order("occurred_at", { ascending: false })
              .limit(100),
            actor.supabase.from("profiles").select("id,email,display_name"),
            actor.supabase.from("access_grants").select("user_id,email"),
          ]);
          if (eventsResult.error) throw eventsResult.error;
          if (profilesResult.error) throw profilesResult.error;
          if (grantsResult.error) throw grantsResult.error;
          const profiles = new Map(
            (profilesResult.data ?? []).map((profile) => [profile.id, profile]),
          );
          const grants = new Map(
            (grantsResult.data ?? [])
              .filter((grant) => grant.user_id)
              .map((grant) => [grant.user_id, grant]),
          );

          return json({
            events: (eventsResult.data ?? []).map((event) => ({
              ...event,
              actor_email: event.actor_id
                ? (profiles.get(event.actor_id)?.email ?? grants.get(event.actor_id)?.email ?? null)
                : null,
              user_email: event.user_id
                ? (profiles.get(event.user_id)?.email ?? grants.get(event.user_id)?.email ?? null)
                : null,
            })),
          });
        } catch (error) {
          return adminErrorResponse(error);
        }
      },
    },
  },
});
