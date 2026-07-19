import type { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getAccessGrant, hasActiveAccess, type AccessGrant } from "../lib/access";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";
import { AuthContext, type AuthContextValue } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [grant, setGrant] = useState<AccessGrant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGrant = useCallback(async (user: User | null) => {
    if (!user) {
      setGrant(null);
      return;
    }

    const nextGrant = await getAccessGrant(user);
    setGrant(nextGrant);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      setSession(data.session);
      await loadGrant(data.session?.user ?? null).catch((grantError: Error) =>
        setError(grantError.message),
      );
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setError(null);
      setTimeout(() => {
        loadGrant(nextSession?.user ?? null).catch((grantError: Error) =>
          setError(grantError.message),
        );
      }, 0);
    });

    return () => data.subscription.unsubscribe();
  }, [loadGrant]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      grant,
      loading,
      error,
      configured: isSupabaseConfigured,
      allowed: hasActiveAccess(grant),
      signInWithGoogle: async (returnTo = "/account") => {
        const safeReturnTo =
          returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/account";
        sessionStorage.setItem("awmate:return-to", safeReturnTo);
        const redirectTo = `${window.location.origin}/auth/callback`;
        const result = await getSupabase().auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });
        if (result.error) throw result.error;
      },
      signOut: async () => {
        const result = await getSupabase().auth.signOut();
        if (result.error) throw result.error;
        setGrant(null);
      },
      refreshAccess: async () => {
        setError(null);
        await loadGrant(session?.user ?? null).catch((grantError: Error) => {
          setError(grantError.message);
          throw grantError;
        });
      },
    }),
    [error, grant, loadGrant, loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
