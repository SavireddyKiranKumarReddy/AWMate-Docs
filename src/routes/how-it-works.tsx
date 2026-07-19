import { createFileRoute } from "@tanstack/react-router";
import { Page, Container, PageHeader, Card } from "@/components/site/Page";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How AWMate works — AWMate Beta" },
      {
        name: "description",
        content: "How AWMate understands projects, reads files, modifies code and runs commands — under your control.",
      },
      { property: "og:title", content: "How AWMate works" },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    n: "01",
    title: "Project understanding",
    body: "You select a folder on your machine. AWMate builds an understanding of the project structure, entry points and important files inside that folder.",
  },
  {
    n: "02",
    title: "File awareness",
    body: "When you ask a question, AWMate opens only the files it needs to answer, and cites them so you can verify.",
  },
  {
    n: "03",
    title: "Code modification",
    body: "AWMate proposes scoped changes as diffs. You approve, edit or reject each change before anything is written to disk.",
  },
  {
    n: "04",
    title: "Command execution",
    body: "AWMate can request approved development, build and test commands. Each command needs your approval before it runs.",
  },
  {
    n: "05",
    title: "Git assistance",
    body: "AWMate helps you summarize diffs, draft commit messages and reason about merges. Destructive git operations still require approval.",
  },
  {
    n: "06",
    title: "Permissions",
    body: "You control which project is active, which files can be read, which commands can run and when.",
  },
];

function HowItWorks() {
  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="How it works"
          title="Understand a project, propose a change, run a command — with you in the loop."
          description="AWMate is an NxtGenSec product designed for professional software engineering. Every action on your machine is scoped and reviewable."
        />

        <div className="grid gap-4 pb-16 md:grid-cols-2">
          {STEPS.map((s) => (
            <Card key={s.n}>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
                {s.n}
              </span>
              <h2 className="mt-3 text-[20px] font-semibold text-text-primary">{s.title}</h2>
              <p className="mt-3 text-[14px] leading-[1.65] text-text-secondary">{s.body}</p>
            </Card>
          ))}
        </div>

        <div className="mx-auto max-w-3xl border-t border-border pt-10 pb-24">
          <h2 className="text-[24px] font-semibold text-text-primary">Professional identity</h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-text-secondary">
            AWMate is presented as a product of NxtGenSec (Next Generation Security). It is
            positioned as an assistive workmate for software engineering and productivity — a
            professional tool, not a replacement for engineering judgement.
          </p>
        </div>
      </Container>
    </Page>
  );
}
