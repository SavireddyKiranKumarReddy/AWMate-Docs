import { createFileRoute } from "@tanstack/react-router";
import { Page, Container, PageHeader, Card } from "@/components/site/Page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AWMate" },
      { name: "description", content: "Get in touch with the AWMate team at NxtGenSec." },
      { property: "og:title", content: "Contact NxtGenSec" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <Page>
      <Container>
        <PageHeader eyebrow="Contact" title="Get in touch with NxtGenSec." />
        <div className="grid gap-4 pb-24 md:grid-cols-2">
          <Card>
            <h2 className="text-[18px] font-semibold text-text-primary">General inquiries</h2>
            <p className="mt-3 text-[14px] text-text-secondary">
              For questions about AWMate, partnerships or press, reach out below.
            </p>
            <a
              href="mailto:hello@nxtgensec.org"
              className="mt-4 inline-block text-[14px] font-medium text-text-primary underline underline-offset-4"
            >
              hello@nxtgensec.org
            </a>
          </Card>
          <Card>
            <h2 className="text-[18px] font-semibold text-text-primary">Security</h2>
            <p className="mt-3 text-[14px] text-text-secondary">
              Report a security concern responsibly to the NxtGenSec security team.
            </p>
            <a
              href="mailto:security@nxtgensec.org"
              className="mt-4 inline-block text-[14px] font-medium text-text-primary underline underline-offset-4"
            >
              security@nxtgensec.org
            </a>
          </Card>
        </div>
      </Container>
    </Page>
  );
}
