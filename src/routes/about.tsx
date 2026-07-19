import { createFileRoute } from "@tanstack/react-router";
import { Page, Container, PageHeader } from "@/components/site/Page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NxtGenSec — Makers of AWMate" },
      { name: "description", content: "AWMate is built by NxtGenSec (Next Generation Security). Learn who we are and what we build." },
      { property: "og:title", content: "About NxtGenSec" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="About"
          title="AWMate is built by NxtGenSec — Next Generation Security."
          description="We build professional software tools that keep engineers in control of their machines and their work."
        />
        <div className="mx-auto max-w-2xl space-y-6 pb-24 text-[16px] leading-[1.75] text-text-secondary">
          <p>
            AWMate is our assistive workmate for software engineering and productivity. It is
            designed for professional developers who want an AI collaborator that stays scoped,
            reviewable and local to their machine.
          </p>
          <p>
            NxtGenSec focuses on tools where safety, transparency and user control are default
            behaviours, not afterthoughts. AWMate Beta is the first product in that line.
          </p>
        </div>
      </Container>
    </Page>
  );
}
