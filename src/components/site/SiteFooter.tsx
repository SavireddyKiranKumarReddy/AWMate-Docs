import { Link } from "@tanstack/react-router";
import { Logo, BetaBadge } from "./Logo";

const COLUMNS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/download", label: "Download" },
      { to: "/changelog", label: "Changelog" },
      { to: "/download", label: "System requirements" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/docs/getting-started", label: "Documentation" },
      { to: "/docs/getting-started", label: "Getting started" },
      { to: "/docs/troubleshooting", label: "Troubleshooting" },
      { to: "/docs/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "NxtGenSec" },
      { to: "/security", label: "Security" },
      { to: "/contact", label: "Contact" },
      { to: "/enterprise", label: "Enterprise" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/legal/privacy-policy", label: "Privacy policy" },
      { to: "/legal/terms-of-service", label: "Terms of service" },
      { to: "/legal/licenses", label: "Licenses" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[14px] text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={24} />
            <span className="text-[14px] font-semibold text-text-primary">AWMate</span>
            <BetaBadge />
          </div>
          <p className="text-[13px] text-text-muted">
            AWMate is powered by NxtGenSec (Next Generation Security).
          </p>
          <p className="text-[12px] text-text-disabled">
            © {year} NxtGenSec. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
