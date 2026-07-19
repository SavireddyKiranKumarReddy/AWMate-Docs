import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://awmate.nxtgensec.org";

const PATHS = [
  "/",
  "/features",
  "/how-it-works",
  "/security",
  "/download",
  "/changelog",
  "/about",
  "/contact",
  "/enterprise",
  "/docs/getting-started",
  "/docs/installation",
  "/docs/projects",
  "/docs/chats",
  "/docs/file-access",
  "/docs/tools",
  "/docs/terminal",
  "/docs/git",
  "/docs/permissions",
  "/docs/updates",
  "/docs/configuration",
  "/docs/troubleshooting",
  "/docs/faq",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/licenses",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = PATHS.map(
          (p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
