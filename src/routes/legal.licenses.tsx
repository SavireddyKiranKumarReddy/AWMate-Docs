import { createFileRoute } from "@tanstack/react-router";
import { Page, Container, PageHeader } from "@/components/site/Page";

export const Route = createFileRoute("/legal/licenses")({
  head: () => ({
    meta: [
      { title: "Licenses — AWMate" },
      { name: "description", content: "Third-party software licenses used in AWMate and the AWMate website." },
      { property: "og:url", content: "/legal/licenses" },
    ],
    links: [{ rel: "canonical", href: "/legal/licenses" }],
  }),
  component: Licenses,
});

function Licenses() {
  return (
    <Page>
      <Container>
        <PageHeader eyebrow="Legal" title="Third-party licenses" description="AWMate is built on open source software. Attribution and license texts for third-party dependencies are included with each release." />
        <div className="mx-auto max-w-2xl space-y-6 pb-24 text-[15px] leading-[1.75] text-text-secondary">
          <p>A full list of open source dependencies and their licenses is bundled with the AWMate desktop application and reproduced in the release notes on GitHub.</p>
          <p>For questions about licensing, contact <a className="text-text-primary underline underline-offset-4" href="mailto:legal@nxtgensec.org">legal@nxtgensec.org</a>.</p>
        </div>
      </Container>
    </Page>
  );
}
