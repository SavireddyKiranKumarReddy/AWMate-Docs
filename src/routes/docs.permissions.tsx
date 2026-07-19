import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P, UL } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/permissions")({
  head: () => ({
    meta: [
      { title: "Permissions — AWMate Docs" },
      { name: "description", content: "The AWMate permission model: scoped file access, command approval and sensitive-file handling." },
      { property: "og:url", content: "/docs/permissions" },
    ],
    links: [{ rel: "canonical", href: "/docs/permissions" }],
  }),
  component: () => (
    <Doc
      title="Permissions"
      path="/docs/permissions"
      intro="AWMate follows a strict permission model. You are always in control of which folders can be read and which commands can run."
    >
      <H2>Scope</H2>
      <UL>
        <li>File reads are limited to the selected project folder.</li>
        <li>Writes require your approval on a per-change basis.</li>
        <li>Command execution requires your approval on a per-command basis.</li>
      </UL>
      <H2>Sensitive files</H2>
      <P>Configuration for excluding secrets, credentials or generated artifacts can be set per project.</P>
      <H2>Credentials</H2>
      <P>Provider credentials required to power AWMate remain server-side. They are never delivered to the browser or the desktop client in plain form.</P>
    </Doc>
  ),
});
