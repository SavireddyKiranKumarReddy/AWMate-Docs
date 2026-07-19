import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink } from "lucide-react";
import { Page, Container, PageHeader, Card } from "@/components/site/Page";
import { fetchLatestRelease, formatBytes } from "@/lib/release";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download AWMate — Windows desktop" },
      {
        name: "description",
        content: "Download the AWMate Beta desktop application for Windows. System requirements, installation steps and SmartScreen guidance.",
      },
      { property: "og:title", content: "Download AWMate" },
      { property: "og:url", content: "/download" },
    ],
    links: [{ rel: "canonical", href: "/download" }],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const { data: release, isLoading } = useQuery({
    queryKey: ["release", "latest"],
    queryFn: fetchLatestRelease,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="Download · Windows · Beta"
          title="Install AWMate on your Windows desktop."
          description="AWMate Beta is distributed as a signed Windows installer via official NxtGenSec releases."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
              Latest release
            </p>
            {isLoading ? (
              <p className="mt-3 text-[14px] text-text-secondary">Checking for the latest release…</p>
            ) : release?.available && release.version ? (
              <>
                <h2 className="mt-2 text-[28px] font-semibold text-text-primary">
                  AWMate {release.version}
                </h2>
                <p className="mt-2 text-[13px] text-text-muted">
                  {release.publishedAt && new Date(release.publishedAt).toLocaleDateString()}
                  {release.windows && ` · Windows installer · ${formatBytes(release.windows.size)}`}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {release.windows ? (
                    <a
                      href={release.windows.url}
                      className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      <Download size={16} />
                      Download for Windows
                    </a>
                  ) : (
                    <span className="text-[13px] text-text-muted">
                      No Windows installer attached to this release yet.
                    </span>
                  )}
                  {release.notesUrl && (
                    <a
                      href={release.notesUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-border px-5 text-[14px] font-medium text-text-primary hover:bg-surface-hover"
                    >
                      Release notes <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-[24px] font-semibold text-text-primary">
                  Public download coming soon
                </h2>
                <p className="mt-3 text-[14px] leading-[1.65] text-text-secondary">
                  {release?.message ??
                    "The first public AWMate Beta release has not been published yet. Check back shortly or read the documentation to get familiar with the product."}
                </p>
                <div className="mt-6">
                  <Link
                    to="/docs/getting-started"
                    className="inline-flex h-11 items-center rounded-[10px] border border-border px-5 text-[14px] font-medium text-text-primary hover:bg-surface-hover"
                  >
                    Read getting started
                  </Link>
                </div>
              </>
            )}
          </Card>

          <Card>
            <h3 className="text-[16px] font-semibold text-text-primary">System requirements</h3>
            <ul className="mt-4 space-y-2 text-[14px] text-text-secondary">
              <li>Windows 10 or Windows 11</li>
              <li>64-bit processor</li>
              <li>~500 MB free storage</li>
              <li>Internet connection required</li>
              <li>Git recommended for full workflow support</li>
            </ul>
          </Card>
        </div>

        <div className="mx-auto mt-16 max-w-3xl border-t border-border pt-10 pb-24">
          <h2 className="text-[24px] font-semibold text-text-primary">Installation steps</h2>
          <ol className="mt-6 space-y-4 text-[15px] leading-[1.7] text-text-secondary">
            <li><span className="text-text-primary">1.</span> Download the Windows installer above.</li>
            <li><span className="text-text-primary">2.</span> Run the installer and follow the setup prompts.</li>
            <li><span className="text-text-primary">3.</span> If Windows SmartScreen shows a warning, verify the publisher and file source before continuing. Do not bypass legitimate security warnings without reason.</li>
            <li><span className="text-text-primary">4.</span> Launch AWMate from the Start menu.</li>
            <li><span className="text-text-primary">5.</span> Select a project folder to get started.</li>
          </ol>
          <p className="mt-8 text-[13px] text-text-muted">
            AWMate is powered by NxtGenSec (Next Generation Security). Only download from
            official release links.
          </p>
        </div>
      </Container>
    </Page>
  );
}
