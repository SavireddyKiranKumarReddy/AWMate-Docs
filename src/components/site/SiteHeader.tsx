import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Logo, BetaBadge } from "./Logo";
import { useAuth } from "../../contexts/auth";

const NAV = [
  { to: "/features", label: "Product" },
  { to: "/features", label: "Features" },
  { to: "/security", label: "Security" },
  { to: "/docs/getting-started", label: "Documentation" },
  { to: "/changelog", label: "Changelog" },
  { to: "/download", label: "Download" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:h-[72px] md:px-8">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 focus-ring rounded-[8px]"
            aria-label="AWMate home"
          >
            <Logo />
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
              AWMate
            </span>
            <BetaBadge />
          </Link>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.slice(0, 5).map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-flex h-9 items-center rounded-[8px] px-3 text-[14px] font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                    activeProps={{ className: "text-text-primary bg-surface-hover" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/docs/getting-started"
            className="inline-flex h-9 items-center rounded-[10px] px-3 text-[14px] font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            View documentation
          </Link>
          {auth.user ? (
            <>
              <Link
                to={auth.allowed ? "/account" : "/access-denied"}
                className="inline-flex h-9 items-center rounded-[10px] border border-border px-3 text-[14px] font-medium text-text-primary transition-colors hover:bg-surface-hover"
              >
                {auth.allowed ? "Account" : "Access pending"}
              </Link>
              <button
                type="button"
                aria-label="Sign out"
                title="Sign out"
                onClick={() => auth.signOut().catch(() => undefined)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-[10px] border border-border px-3 text-[14px] font-medium text-text-primary transition-colors hover:bg-surface-hover"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/download"
            className="inline-flex h-9 items-center rounded-[10px] bg-primary px-4 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Download AWMate
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/download"
            className="inline-flex h-9 items-center rounded-[10px] bg-primary px-3 text-[13px] font-medium text-primary-foreground"
          >
            Download
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border text-text-primary transition-colors hover:bg-surface-hover"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 z-40 border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-[1280px] px-5 py-6">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex h-11 items-center rounded-[10px] px-3 text-[15px] font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3 border-t border-border pt-4">
                <Link
                  to={auth.user ? (auth.allowed ? "/account" : "/access-denied") : "/login"}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center rounded-[10px] px-3 text-[15px] font-medium text-text-primary hover:bg-surface-hover"
                >
                  {auth.user
                    ? auth.allowed
                      ? "Account"
                      : "Access pending"
                    : "Sign in with Google"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
