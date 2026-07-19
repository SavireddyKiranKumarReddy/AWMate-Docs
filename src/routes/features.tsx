import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, Container, PageHeader, Card } from "@/components/site/Page";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — AWMate Beta" },
      {
        name: "description",
        content: "Every AWMate capability explained: what it does, why it is useful, typical workflow and your control.",
      },
      { property: "og:title", content: "Features — AWMate Beta" },
      { property: "og:url", content: "/features" },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: Features,
});

const FEATURES = [
  {
    name: "Project understanding",
    what: "AWMate analyzes the structure and files of the folder you select.",
    why: "You get grounded answers about a real codebase, not generic advice.",
    workflow: "Select a project folder → open a chat → ask about structure, entry points or specific files.",
    control: "Only the selected folder is read. You can switch or remove projects at any time.",
    doc: "/docs/projects",
  },
  {
    name: "File awareness",
    what: "AWMate can inspect relevant source files and understand relationships between components.",
    why: "Answers reference the actual code, imports and call graph in your project.",
    workflow: "Ask about a symbol or file → AWMate opens the files it needs → cites them in the response.",
    control: "You can view every file AWMate accessed for a given response.",
    doc: "/docs/file-access",
  },
  {
    name: "Code modification",
    what: "AWMate can propose and apply scoped changes across one or many files.",
    why: "Refactors, fixes and small features can be prepared as a reviewable set.",
    workflow: "Describe the change → AWMate proposes a diff → you approve, edit or reject before it lands.",
    control: "No file is written without your explicit approval.",
    doc: "/docs/tools",
  },
  {
    name: "Command execution",
    what: "AWMate can run approved development, build and testing commands in your project.",
    why: "You can hand off routine commands without leaving the chat.",
    workflow: "AWMate requests a command → you review and approve → output is captured for reasoning.",
    control: "Every command needs approval. You can deny or edit any request.",
    doc: "/docs/terminal",
  },
  {
    name: "Conversation context",
    what: "Chats retain the project state, open files and prior turns.",
    why: "Follow-up questions stay grounded in what you were just doing.",
    workflow: "Continue a chat → AWMate reuses context → ask a new question in the same thread.",
    control: "Delete or start new chats at any time. Each project keeps its own history.",
    doc: "/docs/chats",
  },
  {
    name: "Git assistance",
    what: "Help with branches, diffs, commit messages and recovery of local work.",
    why: "Keeps git operations transparent and reversible.",
    workflow: "Ask AWMate to summarize a diff, draft a message or explain a merge conflict.",
    control: "Destructive git commands still require explicit approval.",
    doc: "/docs/git",
  },
  {
    name: "Background activity",
    what: "Long-running tasks report progress in the interface.",
    why: "You always know what AWMate is doing on your machine.",
    workflow: "Kick off a task → watch progress in the activity panel → stop it whenever you want.",
    control: "Tasks can be cancelled at any point.",
    doc: "/docs/tools",
  },
  {
    name: "Updates",
    what: "AWMate ships regular updates through signed releases.",
    why: "You get bug fixes and new capabilities without manual patching.",
    workflow: "Updates are announced in the changelog and installed on your schedule.",
    control: "You decide when to install a new version.",
    doc: "/docs/updates",
  },
];

function Features() {
  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="Features"
          title="Everything AWMate Beta can do — and how you stay in control."
          description="Each capability is designed to be transparent and reviewable. AWMate acts on your machine only with your approval."
        />

        <div className="grid grid-cols-1 gap-4 pb-24 md:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.name}>
              <h2 className="text-[20px] font-semibold text-text-primary">{f.name}</h2>
              <dl className="mt-4 space-y-3 text-[14px] leading-[1.6]">
                <Row label="What it does" value={f.what} />
                <Row label="Why it is useful" value={f.why} />
                <Row label="Typical workflow" value={f.workflow} />
                <Row label="User control" value={f.control} />
              </dl>
              <Link
                to={f.doc}
                className="mt-5 inline-flex text-[13px] font-medium text-text-primary hover:opacity-80"
              >
                Read the documentation →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Page>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-text-secondary">{value}</dd>
    </div>
  );
}
