import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LockKeyhole, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Container, Page } from "../components/site/Page";
import { useAuth } from "../contexts/auth";

export const Route = createFileRoute("/access-denied")({
  head: () => ({ meta: [{ title: "Access required — AWMate" }] }),
  component: AccessDeniedPage,
});

function AccessDeniedPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  return (
    <Page>
      <Container className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-[520px] rounded-[16px] border border-border bg-surface p-7 md:p-9">
          <LockKeyhole size={24} className="text-text-secondary" />
          <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
            Access controlled by NxtGenSec
          </p>
          <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-text-primary">
            This Google account is not active yet.
          </h1>
          <p className="mt-4 text-[15px] leading-[1.65] text-text-secondary">
            {auth.user?.email
              ? `${auth.user.email} is signed in, but it does not have an active AWMate access grant.`
              : "Sign in with the Google account that your AWMate administrator approved."}
          </p>
          {auth.grant && (
            <p className="mt-4 text-[13px] text-text-muted">
              Current status:{" "}
              <span className="capitalize text-text-secondary">{auth.grant.status}</span>
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            {auth.user ? (
              <button
                type="button"
                disabled={checking}
                onClick={() => {
                  setChecking(true);
                  auth
                    .refreshAccess()
                    .then(() => navigate({ to: "/account" }))
                    .finally(() => setChecking(false));
                }}
                className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-primary px-5 text-[14px] font-medium text-primary-foreground disabled:opacity-50"
              >
                <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
                Check access again
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-10 items-center rounded-[10px] bg-primary px-5 text-[14px] font-medium text-primary-foreground"
              >
                Sign in with Google
              </Link>
            )}
            <Link
              to="/contact"
              className="inline-flex h-10 items-center rounded-[10px] border border-border px-5 text-[14px] font-medium text-text-primary hover:bg-surface-hover"
            >
              Request access
            </Link>
          </div>
        </div>
      </Container>
    </Page>
  );
}
