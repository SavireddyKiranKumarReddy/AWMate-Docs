import { createFileRoute } from "@tanstack/react-router";

interface NormalizedRelease {
  version: string | null;
  name: string | null;
  publishedAt: string | null;
  notesUrl: string | null;
  windows: { url: string; size: number } | null;
  available: boolean;
  message?: string;
}

export const Route = createFileRoute("/api/releases/latest")({
  server: {
    handlers: {
      GET: async () => {
        const token = process.env.GITHUB_TOKEN;
        const headers: Record<string, string> = {
          Accept: "application/vnd.github+json",
          "User-Agent": "awmate-website",
        };
        if (token) headers.Authorization = `Bearer ${token}`;

        const empty = (message: string): NormalizedRelease => ({
          version: null,
          name: null,
          publishedAt: null,
          notesUrl: null,
          windows: null,
          available: false,
          message,
        });

        try {
          const res = await fetch(
            "https://api.github.com/repos/SavireddyKiranKumarReddy/AWMate/releases/latest",
            { headers },
          );

          if (res.status === 404) {
            return json(empty("No public release available yet."));
          }
          if (res.status === 403) {
            return json(empty("Release information is temporarily unavailable."));
          }
          if (!res.ok) {
            return json(empty("Unable to fetch release information."));
          }

          const data = (await res.json()) as {
            tag_name?: string;
            name?: string;
            html_url?: string;
            published_at?: string;
            draft?: boolean;
            prerelease?: boolean;
            assets?: { name: string; browser_download_url: string; size: number }[];
          };

          if (data.draft) return json(empty("No public release available yet."));

          const exe = data.assets?.find((a) => a.name.toLowerCase().endsWith(".exe")) ?? null;

          const normalized: NormalizedRelease = {
            version: (data.tag_name ?? "").replace(/^v/, "") || null,
            name: data.name ?? data.tag_name ?? null,
            publishedAt: data.published_at ?? null,
            notesUrl: data.html_url ?? null,
            windows: exe ? { url: exe.browser_download_url, size: exe.size } : null,
            available: Boolean(data.tag_name),
          };

          return json(normalized);
        } catch {
          return json(empty("Network error while contacting the release server."));
        }
      },
    },
  },
});

function json(body: NormalizedRelease) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
