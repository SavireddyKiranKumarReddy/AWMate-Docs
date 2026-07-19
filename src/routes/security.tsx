import { createFileRoute } from "@tanstack/react-router";
import { Page, Container, PageHeader, Card } from "@/components/site/Page";
import { Shield, Lock, FileCheck, KeyRound, Users, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — AWMate Beta" },
      {
        name: "description",
        content: "AWMate's security posture: scoped file access, approved commands, server-side credentials and clear user responsibilities.",
      },
      { property: "og:title", content: "Security — AWMate Beta" },
      { property: "og:url", content: "/security" },
    ],
    links: [{ rel: "canonical", href: "/security" }],
  }),
  component: Security,
});

const SECURITY_CONTACT = "security@nxtgensec.org";

const FEATURES = [
  { icon: FileCheck, title: "Scoped file access", body: "AWMate reads only inside the project folder you select. Switching or removing a project immediately revokes that access." },
  { icon: Shield, title: "Command approval", body: "Every terminal or build command AWMate wants to run is presented for your explicit approval." },
  { icon: Lock, title: "Local execution", body: "File reads, edits and command execution happen on your Windows machine. You control the environment." },
  { icon: KeyRound, title: "Server-side credentials", body: "Provider credentials required to power AWMate remain on the server. They are never delivered to the browser or the desktop client in plain form." },
  { icon: Users, title: "Change review", body: "Code changes are always presented as diffs. Nothing is written to disk without your approval." },
  { icon: AlertTriangle, title: "User responsibilities", body: "You should review code and commands before running them in production. Treat AWMate as an assistant, not an unattended agent." },
];

function Security() {
  return (
    <Page>
      <Container>
        <PageHeader
          eyebrow="Security"
          title="Built to be transparent, scoped and reviewable."
          description="AWMate follows a straightforward model: local execution, explicit approval, minimum necessary access. We do not claim certifications that NxtGenSec has not obtained."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <Icon size={18} className="text-text-primary" />
              <h3 className="mt-4 text-[18px] font-semibold text-text-primary">{title}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">{body}</p>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl border-t border-border pt-10 pb-24">
          <h2 className="text-[24px] font-semibold text-text-primary">Report a security issue</h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-text-secondary">
            If you believe you have found a security issue in AWMate, please contact NxtGenSec
            responsibly. Provide reproduction steps and any relevant version information.
          </p>
          <p className="mt-4 text-[14px] text-text-secondary">
            Security contact:{" "}
            <a
              href={`mailto:${SECURITY_CONTACT}`}
              className="text-text-primary underline underline-offset-4"
            >
              {SECURITY_CONTACT}
            </a>
          </p>
          <p className="mt-2 text-[13px] text-text-muted">
            This address is configurable and should be updated via environment configuration for
            production deployments.
          </p>
        </div>
      </Container>
    </Page>
  );
}
