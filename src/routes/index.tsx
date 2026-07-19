import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Download, Shield, Terminal, GitBranch, Folder, MessageSquare, FileCode, Activity, Layers, Wrench, Sparkles } from "lucide-react";
import { Page, Container, Section, Card } from "@/components/site/Page";
import { fetchLatestRelease, formatBytes } from "@/lib/release";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AWMate Beta — Your assistive workmate for building better software" },
      {
        name: "description",
        content:
          "AWMate is your assistive workmate for software engineering and productivity, powered by NxtGenSec. Understand, build, debug and improve software projects.",
      },
      { property: "og:title", content: "AWMate Beta — Your assistive workmate" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const CAPABILITIES = [
  { icon: Folder, title: "Understand complete projects", desc: "Reasons across your codebase to explain structure and relationships." },
  { icon: Layers, title: "Work inside selected folders", desc: "Scoped to the folder you pick — nothing else is read without permission." },
  { icon: FileCode, title: "Explain unfamiliar code", desc: "Ask about any file or symbol and get a plain-language walkthrough." },
  { icon: Wrench, title: "Diagnose errors", desc: "Trace stack traces, logs and failing tests to a likely root cause." },
  { icon: Sparkles, title: "Modify multiple files", desc: "Propose scoped edits across related files with a reviewable diff." },
  { icon: Terminal, title: "Run development commands", desc: "Executes approved build, test and dev commands from your project." },
  { icon: Shield, title: "Review changes", desc: "Every change is presented for your approval before it is applied." },
  { icon: MessageSquare, title: "Maintain conversation context", desc: "Chats remember the project state so follow-ups stay grounded." },
  { icon: Layers, title: "Organize chats by project", desc: "Each project keeps its own history, notes and open questions." },
  { icon: Activity, title: "Show background activity", desc: "Long-running tasks report progress so you always know what is happening." },
  { icon: GitBranch, title: "Assist with Git workflows", desc: "Help with branches, diffs, commit messages and safe recovery." },
  { icon: Sparkles, title: "Support iterative development", desc: "Refine, retry and revert changes as part of your normal loop." },
];

function Home() {
  const { data: release } = useQuery({
    queryKey: ["release", "latest"],
    queryFn: fetchLatestRelease,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Page>
      {/* Hero */}
      <section className="border-b border-border">
        <Container className="pt-20 pb-24 md:pt-28 md:pb-32">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
            AWMate Beta · Powered by NxtGenSec
          </p>
          <h1 className="mt-5 max-w-4xl text-[42px] font-semibold leading-[1.02] tracking-[-0.045em] text-text-primary md:text-[64px]">
            Your assistive workmate for building better software.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-text-secondary md:text-[18px]">
            AWMate helps you understand projects, diagnose errors, modify files, run commands
            and ship changes with confidence — on your Windows desktop, under your control.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/download"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download size={16} />
              Download AWMate
            </Link>
            <Link
              to="/docs/getting-started"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-border px-5 text-[14px] font-medium text-text-primary transition-colors hover:bg-surface-hover"
            >
              View documentation
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-text-muted">
            {release?.available && release.version ? (
              <>
                <span>Version {release.version}</span>
                <span aria-hidden>·</span>
                <span>Windows</span>
                {release.windows && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{formatBytes(release.windows.size)}</span>
                  </>
                )}
                {release.notesUrl && (
                  <>
                    <span aria-hidden>·</span>
                    <a
                      href={release.notesUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-4 hover:text-text-primary"
                    >
                      Release notes
                    </a>
                  </>
                )}
              </>
            ) : (
              <span>Public download coming soon — check back for the first release.</span>
            )}
          </div>

          {/* Screenshot placeholder */}
          <div className="mt-16 overflow-hidden rounded-[18px] border border-border bg-background-elevated">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-surface-active" />
              <span className="h-2.5 w-2.5 rounded-full bg-surface-active" />
              <span className="h-2.5 w-2.5 rounded-full bg-surface-active" />
              <span className="ml-3 text-[11px] uppercase tracking-[0.14em] text-text-muted">
                AWMate — Windows desktop application
              </span>
            </div>
            <div className="flex min-h-[280px] items-center justify-center p-10 md:min-h-[420px]">
              <p className="max-w-md text-center text-[13px] text-text-muted">
                A real product screenshot of the AWMate desktop application will appear here.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Product introduction */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
              What is AWMate
            </p>
            <h2 className="mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-text-primary md:text-[36px]">
              A professional AI workmate that helps you understand, build, debug and improve
              software projects.
            </h2>
            <p className="mt-5 text-[17px] leading-[1.65] text-text-secondary">
              AWMate runs on your Windows desktop. You choose the project folder. AWMate reads
              the files you allow, proposes changes for your review and runs approved commands
              on your machine. You stay in control of every step.
            </p>
          </div>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section className="border-t border-border">
        <Container>
          <div className="mb-12 flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
              Core capabilities
            </p>
            <h2 className="max-w-2xl text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-text-primary md:text-[36px]">
              Everything you need to move through a codebase with intent.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <Icon size={18} className="text-text-primary" />
                <h3 className="mt-4 text-[18px] font-semibold text-text-primary">{title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">{desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Teasers */}
      <Section className="border-t border-border">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            <TeaserCard
              title="How it works"
              body="Project understanding, file awareness, code modification, command execution and permissions — explained end to end."
              to="/how-it-works"
              cta="Read how it works"
            />
            <TeaserCard
              title="Security"
              body="Local-first execution, scoped file access, server-side credentials and clear user responsibilities."
              to="/security"
              cta="Review our security posture"
            />
            <TeaserCard
              title="Documentation"
              body="Installation, first launch, projects, chats, tools, terminal, git, permissions and troubleshooting."
              to="/docs/getting-started"
              cta="Open the docs"
            />
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="border-t border-border">
        <Container>
          <div className="rounded-[18px] border border-border bg-surface p-8 md:p-12">
            <h2 className="max-w-2xl text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-text-primary md:text-[36px]">
              Ready to try AWMate Beta on your Windows desktop?
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] text-text-secondary">
              Install the desktop application, select a project folder and start a chat. You are
              in control of every file, command and change.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/download"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Download size={16} />
                Download AWMate
              </Link>
              <Link
                to="/docs/installation"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-border px-5 text-[14px] font-medium text-text-primary transition-colors hover:bg-surface-hover"
              >
                Installation guide
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

function TeaserCard({ title, body, to, cta }: { title: string; body: string; to: string; cta: string }) {
  return (
    <Card>
      <h3 className="text-[20px] font-semibold text-text-primary">{title}</h3>
      <p className="mt-3 text-[14px] leading-[1.6] text-text-secondary">{body}</p>
      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-primary hover:opacity-80"
      >
        {cta} <ArrowRight size={13} />
      </Link>
    </Card>
  );
}
