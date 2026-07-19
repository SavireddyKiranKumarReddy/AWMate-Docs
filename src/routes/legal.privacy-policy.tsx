import { createFileRoute } from "@tanstack/react-router";
import { Page, Container, PageHeader } from "@/components/site/Page";

export const Route = createFileRoute("/legal/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — AWMate" },
      { name: "description", content: "How AWMate and NxtGenSec handle personal data." },
      { property: "og:url", content: "/legal/privacy-policy" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "/legal/privacy-policy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="Legal"
          title="Privacy policy"
          description="This privacy policy describes how NxtGenSec handles personal data in connection with the AWMate Beta product and website."
        />
        <div className="mx-auto max-w-2xl space-y-6 pb-24 text-[15px] leading-[1.75] text-text-secondary">
          <p>AWMate is a desktop application that runs on your machine. Files inside your selected project remain on your device unless you explicitly send content through the product.</p>
          <p>Website analytics may collect anonymised usage information (page views, referrers, coarse geography) to help improve the site. No sensitive personal data is collected without your consent.</p>
          <p>For privacy questions or requests, contact <a className="text-text-primary underline underline-offset-4" href="mailto:privacy@nxtgensec.org">privacy@nxtgensec.org</a>.</p>
          <p className="text-[13px] text-text-muted">This is a placeholder policy and will be finalised before AWMate exits Beta.</p>
        </div>
      </Container>
    </Page>
  );
}
