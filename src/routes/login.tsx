import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Chrome, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Page, Container } from "../components/site/Page";
import { useAuth } from "../contexts/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AWMate" },
      {
        name: "description",
        content: "Sign in to your approved AWMate account with Google.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (auth.loading || !auth.user) return;
    navigate({ to: auth.allowed ? "/account" : "/access-denied", replace: true });
  }, [auth.allowed, auth.loading, auth.user, navigate]);

  return (
    <Page>
      <Container className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-[440px] rounded-[16px] border border-border bg-surface p-7 md:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-border bg-background">
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
            Approved access only
          </p>
          <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.035em] text-text-primary">
            Sign in to AWMate
          </h1>
          <p className="mt-4 text-[15px] leading-[1.65] text-text-secondary">
            Continue with the Google account approved by NxtGenSec. Public product information,
            documentation and downloads do not require an account.
          </p>

          {!auth.configured && (
            <div className="mt-6 rounded-[10px] border border-amber-400/30 bg-amber-400/5 p-4 text-[13px] leading-relaxed text-amber-200">
              Authentication is not configured on this deployment. Add the Supabase public URL and
              publishable key to the hosting environment.
            </div>
          )}
          {(message || auth.error) && (
            <div className="mt-6 rounded-[10px] border border-red-400/30 bg-red-400/5 p-4 text-[13px] text-red-200">
              {message ?? auth.error}
            </div>
          )}

          <button
            type="button"
            disabled={!auth.configured || auth.loading}
            onClick={() => {
              setMessage(null);
              auth.signInWithGoogle().catch((error: Error) => setMessage(error.message));
            }}
            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-3 rounded-[10px] bg-primary px-5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Chrome size={17} aria-hidden="true" />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-[12px] leading-relaxed text-text-muted">
            By continuing, you agree to the AWMate{" "}
            <Link
              to="/legal/terms-of-service"
              className="text-text-secondary hover:text-text-primary"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              to="/legal/privacy-policy"
              className="text-text-secondary hover:text-text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </Container>
    </Page>
  );
}
