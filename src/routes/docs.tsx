import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const DOC_NAV: { section: string; items: { to: string; label: string }[] }[] = [
  {
    section: "Getting started",
    items: [
      { to: "/docs/getting-started", label: "Introduction" },
      { to: "/docs/installation", label: "Installation" },
      { to: "/docs/projects", label: "Selecting a project" },
      { to: "/docs/chats", label: "Starting a chat" },
    ],
  },
  {
    section: "Core workflow",
    items: [
      { to: "/docs/file-access", label: "File context" },
      { to: "/docs/tools", label: "Code changes & tools" },
      { to: "/docs/terminal", label: "Terminal commands" },
      { to: "/docs/git", label: "Git assistance" },
    ],
  },
  {
    section: "Safety & control",
    items: [
      { to: "/docs/permissions", label: "Permissions" },
      { to: "/docs/updates", label: "Updates" },
    ],
  },
  {
    section: "Reference",
    items: [
      { to: "/docs/configuration", label: "Configuration" },
      { to: "/docs/troubleshooting", label: "Troubleshooting" },
      { to: "/docs/faq", label: "FAQ" },
    ],
  },
];

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

function DocsLayout() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 gap-10 px-5 md:px-8">
        {/* Desktop sidebar */}
        <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-60 shrink-0 overflow-y-auto border-r border-border pr-6 pt-10 md:block">
          <DocNav path={path} />
        </aside>

        {/* Mobile toggle */}
        <div className="fixed bottom-4 right-4 z-40 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-[13px] font-medium text-text-primary shadow-lg"
          >
            <Menu size={14} /> Docs menu
          </button>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 bg-background md:hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-text-muted">
                Documentation
              </span>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-60px)] overflow-y-auto px-5 py-6" onClick={() => setOpen(false)}>
              <DocNav path={path} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 py-10 md:py-14">
          <article className="mx-auto max-w-[760px]">
            <Outlet />
          </article>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

function DocNav({ path }: { path: string }) {
  return (
    <nav aria-label="Documentation">
      <ul className="space-y-6">
        {DOC_NAV.map((sec) => (
          <li key={sec.section}>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
              {sec.section}
            </p>
            <ul className="mt-2 space-y-0.5">
              {sec.items.map((item) => {
                const active = path === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`block rounded-[8px] px-2.5 py-1.5 text-[14px] transition-colors ${
                        active
                          ? "bg-surface-hover text-text-primary"
                          : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
