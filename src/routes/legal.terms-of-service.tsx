import { createFileRoute } from "@tanstack/react-router";
import { Page, Container, PageHeader } from "@/components/site/Page";

export const Route = createFileRoute("/legal/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of service — AWMate" },
      { name: "description", content: "The terms that govern use of AWMate and the AWMate website." },
      { property: "og:url", content: "/legal/terms-of-service" },
    ],
    links: [{ rel: "canonical", href: "/legal/terms-of-service" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="Legal"
          title="Terms of service"
          description="By downloading or using AWMate you agree to these terms."
        />
        <div className="mx-auto max-w-2xl space-y-6 pb-24 text-[15px] leading-[1.75] text-text-secondary">
          <p>AWMate is provided in Beta and may change without notice. You are responsible for reviewing changes AWMate proposes and commands it requests to run.</p>
          <p>AWMate is provided as-is, without warranty of any kind. NxtGenSec is not liable for damages caused by improper use, unreviewed changes or approved commands.</p>
          <p className="text-[13px] text-text-muted">This is a placeholder document. Final terms will be published before AWMate exits Beta.</p>
        </div>
      </Container>
    </Page>
  );
}
