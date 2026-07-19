import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccessGrant, hasActiveAccess } from "../lib/access";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Completing sign in — AWMate" }] }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Authentication is not configured on this deployment.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error_description") ?? params.get("error");
    if (oauthError) {
      setError(oauthError);
      return;
    }

    const code = params.get("code");
    if (!code) {
      setError("Google did not return a valid authorization code.");
      return;
    }

    getSupabase()
      .auth.exchangeCodeForSession(code)
      .then(async ({ data, error: exchangeError }) => {
        if (exchangeError) throw exchangeError;
        if (!data.user) throw new Error("No user was returned after sign in.");

        const grant = await getAccessGrant(data.user);
        const returnTo = sessionStorage.getItem("awmate:return-to") ?? "/account";
        sessionStorage.removeItem("awmate:return-to");
        navigate({
          to: hasActiveAccess(grant) ? returnTo : "/access-denied",
          replace: true,
        });
      })
      .catch((callbackError: Error) => setError(callbackError.message));
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md">
        {error ? (
          <>
            <h1 className="text-2xl font-semibold text-text-primary">
              Sign in could not be completed
            </h1>
            <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">{error}</p>
            <a
              href="/login"
              className="mt-7 inline-flex h-10 items-center rounded-[10px] border border-border px-5 text-sm font-medium text-text-primary hover:bg-surface-hover"
            >
              Try again
            </a>
          </>
        ) : (
          <>
            <LoaderCircle className="mx-auto animate-spin text-text-secondary" size={26} />
            <h1 className="mt-5 text-xl font-semibold text-text-primary">
              Completing secure sign in
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Verifying your Google account and access.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
