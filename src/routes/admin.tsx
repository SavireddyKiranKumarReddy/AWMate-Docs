import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, RefreshCw, Search, ShieldCheck, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, Container, Page, PageHeader } from "../components/site/Page";
import { useAuth } from "../contexts/auth";

type Role = "owner" | "admin" | "member" | "auditor";
type Status = "active" | "pending" | "suspended" | "revoked";
type Usage = {
  todayRequests: number;
  todayTokens: number;
  todayCostMicros: number;
  monthRequests: number;
  monthTokens: number;
  monthCostMicros: number;
  lastActivity: string | null;
};
type ManagedUser = {
  id: string;
  user_id: string | null;
  email: string;
  role: Role;
  status: Status;
  daily_request_limit: number | null;
  monthly_token_limit: number | null;
  approved_at: string | null;
  expires_at: string | null;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
  auth_created_at: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  usage: Usage;
};
type AuditEvent = {
  id: number;
  event_type: string;
  actor_email: string | null;
  user_email: string | null;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  occurred_at: string;
};

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — AWMate" }] }),
  component: AdminPage,
});

function AdminPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const isAdmin = auth.allowed && (auth.grant?.role === "owner" || auth.grant?.role === "admin");

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      navigate({ to: "/login", replace: true, search: { returnTo: "/admin" } });
      return;
    }
    if (!isAdmin) navigate({ to: "/access-denied", replace: true });
  }, [auth.loading, auth.user, isAdmin, navigate]);

  const request = useCallback(
    async <T,>(path: string, init?: RequestInit) => {
      if (!auth.session) throw new Error("Your session has expired. Please sign in again.");
      const response = await fetch(path, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.session.access_token}`,
          ...init?.headers,
        },
      });
      const body = (await response.json()) as T & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Admin request failed.");
      return body;
    },
    [auth.session],
  );

  const load = useCallback(async () => {
    if (!isAdmin || !auth.session) return;
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, auditResponse] = await Promise.all([
        request<{ users: ManagedUser[] }>("/api/admin/users"),
        request<{ events: AuditEvent[] }>("/api/admin/audit"),
      ]);
      setUsers(usersResponse.users);
      setEvents(auditResponse.events);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  }, [auth.session, isAdmin, request]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (user) =>
        user.email.includes(query) ||
        user.display_name?.toLowerCase().includes(query) ||
        user.role.includes(query) ||
        user.status.includes(query),
    );
  }, [search, users]);

  const totals = useMemo(
    () => ({
      active: users.filter((user) => user.status === "active").length,
      pending: users.filter((user) => user.status === "pending").length,
      monthRequests: users.reduce((sum, user) => sum + user.usage.monthRequests, 0),
      monthTokens: users.reduce((sum, user) => sum + user.usage.monthTokens, 0),
    }),
    [users],
  );

  if (auth.loading || !auth.user || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-sm text-text-muted">
        Verifying administrator access…
      </main>
    );
  }

  return (
    <Page>
      <Container className="pb-24">
        <PageHeader
          eyebrow="Owner console"
          title="AWMate administration"
          description="Approve accounts, control roles and limits, inspect usage, and review security activity from one protected workspace."
        />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-secondary">
            Signed in as <span className="font-medium text-text-primary">{auth.user.email}</span>
            <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-[11px] uppercase tracking-wider text-text-muted">
              {auth.grant?.role}
            </span>
          </p>
          <Button variant="outline" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={loading ? "animate-spin" : ""} /> Refresh data
          </Button>
        </div>

        {error && <Message tone="error">{error}</Message>}
        {notice && <Message tone="success">{notice}</Message>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={<Users />} label="Approved records" value={users.length.toLocaleString()} />
          <Stat
            icon={<ShieldCheck />}
            label="Active users"
            value={totals.active.toLocaleString()}
            detail={`${totals.pending} pending`}
          />
          <Stat
            icon={<Activity />}
            label="Requests this month"
            value={totals.monthRequests.toLocaleString()}
          />
          <Stat icon={<Activity />} label="Tokens this month" value={compact(totals.monthTokens)} />
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <AddUser
            owner={auth.grant?.role === "owner"}
            onSubmit={async (input) => {
              setError(null);
              await request("/api/admin/users", { method: "POST", body: JSON.stringify(input) });
              setNotice(`${input.email} is now in the access list.`);
              await load();
            }}
          />

          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                  People and access
                </h2>
                <p className="mt-1 text-sm text-text-muted">{filtered.length} records shown</p>
              </div>
              <label className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search email, role or status"
                  className="pl-9"
                />
              </label>
            </div>

            <div className="space-y-3">
              {loading && users.length === 0 ? (
                <Card className="text-sm text-text-muted">Loading access records…</Card>
              ) : filtered.length === 0 ? (
                <Card className="text-sm text-text-muted">
                  No access records match this search.
                </Card>
              ) : (
                filtered.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    owner={auth.grant?.role === "owner"}
                    onSave={async (input) => {
                      setError(null);
                      await request("/api/admin/users", {
                        method: "PATCH",
                        body: JSON.stringify(input),
                      });
                      setNotice(`${user.email} was updated.`);
                      await load();
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight text-text-primary">
              Latest administrative activity
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              The 100 most recent privileged access changes.
            </p>
          </div>
          <Card className="overflow-hidden p-0 md:p-0">
            {events.length === 0 ? (
              <p className="p-6 text-sm text-text-muted">
                No administrative changes have been recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="grid gap-1 px-5 py-4 text-sm md:grid-cols-[1fr_1fr_auto] md:items-center"
                  >
                    <div>
                      <p className="font-medium text-text-primary">
                        {event.event_type.replaceAll("_", " ").replaceAll(".", " · ")}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        Target:{" "}
                        {event.user_email ??
                          String(event.metadata.email ?? event.resource_id ?? "Unknown")}
                      </p>
                    </div>
                    <p className="text-text-secondary">By {event.actor_email ?? "System"}</p>
                    <time className="text-xs text-text-muted">
                      {formatDateTime(event.occurred_at)}
                    </time>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </Container>
    </Page>
  );
}

function AddUser({
  owner,
  onSubmit,
}: {
  owner: boolean;
  onSubmit: (input: GrantInput) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [status, setStatus] = useState<Status>("active");
  const [daily, setDaily] = useState("");
  const [monthly, setMonthly] = useState("");
  const [expiry, setExpiry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        email,
        role,
        status,
        dailyRequestLimit: numberOrNull(daily),
        monthlyTokenLimit: numberOrNull(monthly),
        expiresAt: expiry ? new Date(`${expiry}T23:59:59.999Z`).toISOString() : null,
      });
      setEmail("");
      setRole("member");
      setStatus("active");
      setDaily("");
      setMonthly("");
      setExpiry("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to add this user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="h-fit xl:sticky xl:top-24">
      <div className="flex items-center gap-3">
        <UserPlus className="h-5 w-5 text-text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">Add or approve user</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        Add the Google email before or after its first sign-in. Edit existing records in the access
        list.
      </p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Field label="Google account email">
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="person@example.com"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Role">
            <NativeSelect
              value={role}
              onChange={(value) => setRole(value as Role)}
              options={owner ? ROLES : ROLES.filter((item) => item !== "owner" && item !== "admin")}
            />
          </Field>
          <Field label="Status">
            <NativeSelect
              value={status}
              onChange={(value) => setStatus(value as Status)}
              options={STATUSES}
            />
          </Field>
        </div>
        <Field label="Daily request limit">
          <Input
            type="number"
            min="0"
            value={daily}
            onChange={(event) => setDaily(event.target.value)}
            placeholder="Unlimited"
          />
        </Field>
        <Field label="Monthly token limit">
          <Input
            type="number"
            min="0"
            value={monthly}
            onChange={(event) => setMonthly(event.target.value)}
            placeholder="Unlimited"
          />
        </Field>
        <Field label="Access expires">
          <Input type="date" value={expiry} onChange={(event) => setExpiry(event.target.value)} />
        </Field>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button className="w-full" disabled={saving}>
          {saving ? "Saving…" : "Save access"}
        </Button>
      </form>
    </Card>
  );
}

type GrantInput = {
  email: string;
  role: Role;
  status: Status;
  dailyRequestLimit: number | null;
  monthlyTokenLimit: number | null;
  expiresAt: string | null;
};

function UserCard({
  user,
  owner,
  onSave,
}: {
  user: ManagedUser;
  owner: boolean;
  onSave: (input: Omit<GrantInput, "email"> & { id: string }) => Promise<void>;
}) {
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [daily, setDaily] = useState(user.daily_request_limit?.toString() ?? "");
  const [monthly, setMonthly] = useState(user.monthly_token_limit?.toString() ?? "");
  const [expiry, setExpiry] = useState(user.expires_at?.slice(0, 10) ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const protectedRole = !owner && (user.role === "owner" || user.role === "admin");

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await onSave({
        id: user.id,
        role,
        status,
        dailyRequestLimit: numberOrNull(daily),
        monthlyTokenLimit: numberOrNull(monthly),
        expiresAt: expiry ? new Date(`${expiry}T23:59:59.999Z`).toISOString() : null,
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update this user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border border-border"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-text-secondary">
              {user.email[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate font-medium text-text-primary">
              {user.display_name ?? user.email}
            </h3>
            <p className="truncate text-sm text-text-muted">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2 text-[11px] uppercase tracking-wider">
          <span className="rounded-full border border-border px-2 py-1 text-text-secondary">
            {user.role}
          </span>
          <span
            className={`rounded-full border px-2 py-1 ${user.status === "active" ? "border-emerald-900 text-emerald-300" : "border-border text-text-muted"}`}
          >
            {user.status}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Today" value={`${user.usage.todayRequests.toLocaleString()} requests`} />
        <MiniStat label="This month" value={`${compact(user.usage.monthTokens)} tokens`} />
        <MiniStat label="Last sign-in" value={formatDateTime(user.last_sign_in_at)} />
        <MiniStat label="Account" value={user.user_id ? "Google linked" : "Awaiting first login"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Role">
          <NativeSelect
            disabled={protectedRole}
            value={role}
            onChange={(value) => setRole(value as Role)}
            options={owner ? ROLES : ROLES.filter((item) => item !== "owner" && item !== "admin")}
          />
        </Field>
        <Field label="Status">
          <NativeSelect
            disabled={protectedRole}
            value={status}
            onChange={(value) => setStatus(value as Status)}
            options={STATUSES}
          />
        </Field>
        <Field label="Daily requests">
          <Input
            disabled={protectedRole}
            type="number"
            min="0"
            value={daily}
            onChange={(event) => setDaily(event.target.value)}
            placeholder="Unlimited"
          />
        </Field>
        <Field label="Monthly tokens">
          <Input
            disabled={protectedRole}
            type="number"
            min="0"
            value={monthly}
            onChange={(event) => setMonthly(event.target.value)}
            placeholder="Unlimited"
          />
        </Field>
        <Field label="Expires">
          <Input
            disabled={protectedRole}
            type="date"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
          />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-text-muted">
          Last activity: {formatDateTime(user.usage.lastActivity)} · Approved:{" "}
          {formatDateTime(user.approved_at)}
        </p>
        <Button variant="outline" onClick={() => void save()} disabled={saving || protectedRole}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
      {protectedRole && (
        <p className="mt-3 text-xs text-amber-300">
          Only an owner can change this privileged account.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </Card>
  );
}

const ROLES: Role[] = ["owner", "admin", "member", "auditor"];
const STATUSES: Status[] = ["active", "pending", "suspended", "revoked"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-text-muted">{label}</span>
      {children}
    </label>
  );
}

function NativeSelect({
  value,
  onChange,
  options,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <select
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-text-primary outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option[0]?.toUpperCase()}
          {option.slice(1)}
        </option>
      ))}
    </select>
  );
}

function Stat({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-text-muted">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-text-primary">{value}</p>
      {detail && <p className="mt-1 text-xs text-text-muted">{detail}</p>}
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-[11px] uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 truncate text-sm text-text-primary">{value}</p>
    </div>
  );
}

function Message({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  return (
    <div
      className={`mb-5 rounded-xl border px-4 py-3 text-sm ${tone === "error" ? "border-red-950 bg-red-950/20 text-red-300" : "border-emerald-950 bg-emerald-950/20 text-emerald-300"}`}
    >
      {children}
    </div>
  );
}

function numberOrNull(value: string) {
  return value.trim() === "" ? null : Number(value);
}

function compact(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

function formatDateTime(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
