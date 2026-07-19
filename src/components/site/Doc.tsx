import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { DOC_NAV } from "@/routes/docs";

export function Doc({
  title,
  intro,
  path,
  children,
}: {
  title: string;
  intro?: string;
  path: string;
  children: ReactNode;
}) {
  const flat = DOC_NAV.flatMap((s) => s.items);
  const idx = flat.findIndex((i) => i.to === path);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  return (
    <>
      <nav className="mb-6 text-[12px] text-text-muted" aria-label="Breadcrumb">
        <Link to="/docs/getting-started" className="hover:text-text-secondary">
          Documentation
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{title}</span>
      </nav>
      <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary md:text-[42px]">
        {title}
      </h1>
      {intro && (
        <p className="mt-5 text-[17px] leading-[1.7] text-text-secondary md:text-[18px]">
          {intro}
        </p>
      )}
      <div className="prose-doc mt-10 text-[16px] leading-[1.75] text-text-secondary">
        {children}
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        {prev ? (
          <Link
            to={prev.to}
            className="text-[13px] text-text-secondary hover:text-text-primary"
          >
            ← {prev.label}
          </Link>
        ) : <span />}
        {next ? (
          <Link
            to={next.to}
            className="text-[13px] text-text-secondary hover:text-text-primary"
          >
            {next.label} →
          </Link>
        ) : <span />}
      </div>
    </>
  );
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="mt-12 text-[24px] font-semibold tracking-[-0.02em] text-text-primary"
    >
      {children}
    </h2>
  );
}
export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4">{children}</p>;
}
export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-text-muted">{children}</ul>;
}
export function OL({ children }: { children: ReactNode }) {
  return <ol className="mt-4 list-decimal space-y-2 pl-6 marker:text-text-muted">{children}</ol>;
}
export function Callout({ children, title = "Note" }: { children: ReactNode; title?: string }) {
  return (
    <aside className="mt-6 rounded-[12px] border border-border bg-surface p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
        {title}
      </p>
      <div className="mt-2 text-[14px] leading-[1.65] text-text-secondary">{children}</div>
    </aside>
  );
}
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[6px] border border-border bg-surface px-1.5 py-0.5 font-mono text-[13px] text-text-primary">
      {children}
    </code>
  );
}
