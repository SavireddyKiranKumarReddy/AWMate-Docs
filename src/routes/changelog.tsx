import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Page, Container, PageHeader, Card } from "@/components/site/Page";
import { fetchLatestRelease } from "@/lib/release";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — AWMate Beta" },
      { name: "description", content: "Release notes and version history for AWMate Beta." },
      { property: "og:title", content: "AWMate Changelog" },
      { property: "og:url", content: "/changelog" },
    ],
    links: [{ rel: "canonical", href: "/changelog" }],
  }),
  component: Changelog,
});

function Changelog() {
  const { data, isLoading } = useQuery({
    queryKey: ["release", "latest"],
    queryFn: fetchLatestRelease,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="Changelog"
          title="What's new in AWMate."
          description="Detailed release notes are published on GitHub for each version."
        />
        <div className="pb-24">
          {isLoading ? (
            <p className="text-[14px] text-text-secondary">Loading latest release…</p>
          ) : data?.available && data.version ? (
            <Card>
              <p className="text-[11px] uppercase tracking-[0.14em] text-text-muted">
                {data.publishedAt && new Date(data.publishedAt).toLocaleDateString()}
              </p>
              <h2 className="mt-2 text-[24px] font-semibold text-text-primary">
                {data.name ?? `AWMate ${data.version}`}
              </h2>
              <p className="mt-3 text-[14px] text-text-secondary">
                Full release notes and downloadable assets are published on GitHub.
              </p>
              {data.notesUrl && (
                <a
                  href={data.notesUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex h-10 items-center rounded-[10px] border border-border px-4 text-[14px] font-medium text-text-primary hover:bg-surface-hover"
                >
                  Open release notes on GitHub
                </a>
              )}
            </Card>
          ) : (
            <Card>
              <h2 className="text-[20px] font-semibold text-text-primary">No releases yet</h2>
              <p className="mt-3 text-[14px] text-text-secondary">
                {data?.message ?? "The first public AWMate Beta release has not been published yet."}
              </p>
            </Card>
          )}
        </div>
      </Container>
    </Page>
  );
}
