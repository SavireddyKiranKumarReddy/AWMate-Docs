import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import type { AccessGrant } from "../lib/access";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  grant: AccessGrant | null;
  loading: boolean;
  error: string | null;
  configured: boolean;
  allowed: boolean;
  signInWithGoogle: (returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAccess: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
