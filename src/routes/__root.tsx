import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import logoAsset from "../assets/aw-logo.png.asset.json";
import { AuthProvider } from "../contexts/AuthContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Error 404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.035em] text-text-primary">
            Page not found
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
            The page you are looking for does not exist, has moved, or is not part of the AWMate
            Beta website.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex h-10 items-center rounded-[10px] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Go home
            </Link>
            <Link
              to="/docs/getting-started"
              className="inline-flex h-10 items-center rounded-[10px] border border-border px-5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-text-primary">This page didn&apos;t load</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Something went wrong. You can try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-10 items-center rounded-[10px] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-10 items-center rounded-[10px] border border-border px-5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "color-scheme", content: "dark" },
      { name: "theme-color", content: "#050505" },
      { title: "AWMate Beta — Your assistive workmate for building better software" },
      {
        name: "description",
        content:
          "AWMate is a professional AI assistive workmate for software engineering and productivity, powered by NxtGenSec.",
      },
      { name: "author", content: "NxtGenSec" },
      { property: "og:site_name", content: "AWMate" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "AWMate Beta — Your assistive workmate" },
      {
        property: "og:description",
        content:
          "A professional AI workmate that helps you understand, build, debug and improve software projects. Powered by NxtGenSec.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AWMate Beta — NxtGenSec" },
      {
        name: "twitter:description",
        content: "Assistive workmate for software engineering and productivity.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: logoAsset.url },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NxtGenSec",
          alternateName: "Next Generation Security",
          url: "https://awmate.nxtgensec.org",
          logo: logoAsset.url,
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-text-primary antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
