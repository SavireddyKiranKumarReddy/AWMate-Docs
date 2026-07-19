import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${className}`}>{children}</div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`py-16 md:py-24 lg:py-[120px] ${className}`}>{children}</section>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl pt-16 pb-8 md:pt-24 md:pb-12">
      {eyebrow && (
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
          {eyebrow}
        </p>
      )}
      <h1 className="text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] text-text-primary md:text-[48px]">
        {title}
      </h1>
      {description && (
        <p className="mt-5 text-[17px] leading-[1.65] text-text-secondary md:text-[18px]">
          {description}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[14px] border border-border bg-surface p-6 transition-colors hover:bg-surface-hover md:p-7 ${className}`}
    >
      {children}
    </div>
  );
}
