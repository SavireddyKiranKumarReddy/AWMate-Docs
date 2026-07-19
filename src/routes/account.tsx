import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { Card, Container, Page, PageHeader } from "../components/site/Page";
import { useAuth } from "../contexts/auth";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — AWMate" }] }),
  component: AccountPage,
});

function AccountPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (!auth.allowed) navigate({ to: "/access-denied", replace: true });
  }, [auth.allowed, auth.loading, auth.user, navigate]);

  if (auth.loading || !auth.user || !auth.allowed || !auth.grant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-sm text-text-muted">
        Verifying account access…
      </main>
    );
  }

  return (
    <Page>
      <Container className="pb-24">
        <PageHeader
          eyebrow="Secure account"
          title="Your AWMate access"
          description="Your Google identity and AWMate access policy are managed separately. NxtGenSec controls role, status and usage limits."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <ShieldCheck size={19} className="text-emerald-300" />
              <h2 className="text-[17px] font-semibold text-text-primary">Active access</h2>
            </div>
            <dl className="mt-6 space-y-4 text-[14px]">
              <div>
                <dt className="text-text-muted">Google account</dt>
                <dd className="mt-1 break-all text-text-primary">{auth.user.email}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Role</dt>
                <dd className="mt-1 capitalize text-text-primary">{auth.grant.role}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Status</dt>
                <dd className="mt-1 capitalize text-emerald-300">{auth.grant.status}</dd>
              </div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-[17px] font-semibold text-text-primary">Usage policy</h2>
            <dl className="mt-6 space-y-4 text-[14px]">
              <div>
                <dt className="text-text-muted">Daily request limit</dt>
                <dd className="mt-1 text-text-primary">
                  {auth.grant.daily_request_limit?.toLocaleString() ?? "Managed by your plan"}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Monthly token limit</dt>
                <dd className="mt-1 text-text-primary">
                  {auth.grant.monthly_token_limit?.toLocaleString() ?? "Managed by your plan"}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Access expiry</dt>
                <dd className="mt-1 text-text-primary">
                  {auth.grant.expires_at
                    ? new Date(auth.grant.expires_at).toLocaleDateString()
                    : "No scheduled expiry"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </Container>
    </Page>
  );
}
