
# AWMate Website Build Plan

Build a production-ready public website for **AWMate** (by NxtGenSec) per the uploaded Build Guide. The guide specifies Next.js, but this project is on the mandated **TanStack Start + React 19 + Tailwind v4** stack — I'll implement the same requirements (App Router-style file routes, server-only release fetching, static-first rendering) using TanStack Start's file-based routes and `createServerFn`. Everything else (design, content, routes, SEO, a11y) follows the doc exactly.

## Brand & assets
- Upload `AW.png` as a Lovable Asset; use it as favicon + header/footer logo.
- Wordmark: "AWMate" with a small **Beta** pill next to it in the header (and mentioned in hero eyebrow: "AWMate Beta · Powered by NxtGenSec").
- Never mention Big Pickle, OpenCode, providers, or internal infra.

## Design system (dark only)
- Tailwind v4 tokens in `src/styles.css` mapped to the exact palette from the doc (`--background #050505`, `--surface #0F0F0F`, borders at 10%/20% white, text white with opacity tiers, primary button = white on near-black).
- `color-scheme: dark` on `:root`; no light theme, no theme switcher, no gradients/neon/glass.
- Fonts via a `<link>` in `__root.tsx` head (Tailwind v4 rule): **Geist Sans** + **Geist Mono** from Google Fonts. Weight scale 400/500/600/700.
- Typography scale (desktop + mobile) exactly as specified (hero 64/42, page 48/36, section 36/28, etc.).
- 8px spacing system; max width 1280, content 1200, docs article 760; radii 8/10/14/18.

## Routes (TanStack file-based, one file per page)
```
/, /features, /how-it-works, /security, /download,
/docs (layout with sidebar + Outlet),
  /docs/getting-started, /installation, /projects, /chats,
  /file-access, /tools, /terminal, /git, /permissions,
  /updates, /configuration, /troubleshooting, /faq
/changelog, /about, /contact, /enterprise,
/legal/privacy-policy, /legal/terms-of-service, /legal/licenses
```
Plus a custom 404 via `notFoundComponent` in `__root.tsx`. Each leaf route sets its own `head()` (title, description, og:title/description, twitter, canonical). Root sets no `og:image`; leaf pages with hero imagery set `og:image`.

## Global chrome
- **SiteHeader** (sticky, black w/ subtle opacity + minimal backdrop blur, 1px bottom border, 72/64px): AW logo + "AWMate" + Beta badge on left; nav (Product, Features, Security, Documentation, Changelog, Download); right side "View documentation" secondary + white "Download AWMate" primary. Mobile: accessible menu button + full-screen drawer, focus-visible states, ESC/tab handling.
- **SiteFooter**: 4 columns (Product / Resources / Company / Legal) exactly as listed, bottom row with AW logo, "AWMate is powered by NxtGenSec (Next Generation Security).", `© {year}`, version from release API when available. Only real links.

## Homepage
Hero (eyebrow, 64px heading "Your assistive workmate for building better software.", supporting copy, primary Download + secondary View documentation, dynamic version/OS/size line from `/api/releases/latest`, real screenshot placeholder card — no fake UI mockup fabricated). Sections: Product introduction, Core capabilities (12 cards from the doc), How it works teaser, Security teaser, Documentation teaser, Download CTA.

## Feature pages
- `/features`: cards for each capability with What / Why / Typical workflow / User control / Docs link.
- `/how-it-works`: project understanding, file awareness, code modification, command execution, git, permissions, identity note.
- `/security`: threat model, permission model, credential handling (server-side only), user responsibilities, no invented certifications, env-driven security contact.
- `/download`: pulls latest from server fn; SmartScreen guidance (no "bypass blindly"), system requirements list, install steps, link to release notes.
- `/changelog`: renders GitHub releases.
- `/about`, `/contact`, `/enterprise`, `/legal/*`: honest content per doc, no fabricated numbers/logos/testimonials.

## Docs
- `src/routes/docs.tsx` layout: fixed left nav (desktop), centered article (max 760px), right-side page TOC on ≥1280px, mobile drawer.
- Structured MDX-like content as TSX with a small `<Prose>` + `<Callout>` + `<CodeBlock>` component set.
- Sections from the guide: Getting started, Core workflow, Development, Safety, Reference.
- In-page anchor headings; breadcrumbs; prev/next; simple client-side search over a generated docs index.

## Server / release API
- `src/routes/api/releases/latest.ts` server route → fetches `https://api.github.com/repos/nxtgensec/awmate/releases/latest` server-side, normalizes to `{ version, name, publishedAt, notesUrl, windows: { url, size } }`. Uses `process.env.GITHUB_TOKEN` if present (never exposed). Handles: 404 (no release), no `.exe` asset, rate limit, network error, drafts/prereleases skipped, `Cache-Control: s-maxage=600, stale-while-revalidate=86400`.
- Consumed via `createServerFn` from pages (hero, /download, footer version) with TanStack Query `ensureQueryData` in the route loader + `useSuspenseQuery` in the component.
- Config/schema JSON endpoints under `/api/*` with correct content-type, CORS, cache; no HTML fallback, no secrets.

## SEO / a11y / quality
- Per-route `head()`, sitemap route (`/sitemap.xml`), `/robots.txt`, JSON-LD (Organization, SoftwareApplication, Breadcrumbs for docs).
- Semantic landmarks, focus-visible rings, reduced-motion respected, dialog/menu a11y, alt text.
- No `NEXT_PUBLIC_`-style leaks; secrets only in `process.env` inside server handlers.
- Verify: `tsgo` typecheck, build, responsive spot-checks at 375/768/1024/1440 via Playwright screenshots of `/`, `/features`, `/docs/getting-started`, `/download`.

## Technical notes (for engineers)
- **Stack swap**: doc says Next.js App Router; using TanStack Start file routes under `src/routes/`. `createServerFn` replaces Next server actions; `src/routes/api/*` server routes replace Next route handlers. Same architectural guarantees (SSR-safe, server-only fetch, static-friendly).
- No `src/pages/`. Root layout stays in `src/routes/__root.tsx`; docs layout in `src/routes/docs.tsx` with `<Outlet />`.
- Fonts loaded via `<link>` in `__root.tsx` head (not `@import` — Tailwind v4 filesystem resolver).
- Home page replaces the placeholder `src/routes/index.tsx`.
- AW logo saved as Lovable Asset (`src/assets/aw-logo.png.asset.json`) and imported.

## Out of scope for this build
- Real GitHub release under `nxtgensec/awmate` — API endpoint is wired; if the repo has no public release, UI degrades gracefully to "Coming soon" copy (no fake download links).
- Real screenshot of AWMate app — a neutral placeholder frame is shown with copy explaining no mock UI is fabricated; swap-in later when the user provides the real image.
