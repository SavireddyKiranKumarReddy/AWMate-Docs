import { createFileRoute } from "@tanstack/react-router";
import { Page, Container, PageHeader } from "@/components/site/Page";

export const Route = createFileRoute("/enterprise")({
  head: () => ({
    meta: [
      { title: "Enterprise — AWMate" },
      { name: "description", content: "AWMate for organizations: procurement, security review and volume deployment." },
      { property: "og:title", content: "AWMate for Enterprise" },
      { property: "og:url", content: "/enterprise" },
    ],
    links: [{ rel: "canonical", href: "/enterprise" }],
  }),
  component: Enterprise,
});

function Enterprise() {
  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="Enterprise"
          title="AWMate for teams and organizations."
          description="AWMate Beta is in active development. Enterprise engagements are handled directly by the NxtGenSec team."
        />
        <div className="mx-auto max-w-2xl space-y-6 pb-24 text-[16px] leading-[1.75] text-text-secondary">
          <p>
            If your team is evaluating AWMate for internal use, we can help with procurement
            paperwork, security review and volume deployment planning.
          </p>
          <p>
            Reach out at{" "}
            <a
              href="mailto:enterprise@nxtgensec.org"
              className="text-text-primary underline underline-offset-4"
            >
              enterprise@nxtgensec.org
            </a>{" "}
            to start a conversation.
          </p>
        </div>
      </Container>
    </Page>
  );
}
