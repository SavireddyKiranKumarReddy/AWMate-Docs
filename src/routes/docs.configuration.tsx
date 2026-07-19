import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/configuration")({
  head: () => ({
    meta: [
      { title: "Configuration — AWMate Docs" },
      { name: "description", content: "Configure AWMate: project settings, ignored paths and workflow preferences." },
      { property: "og:url", content: "/docs/configuration" },
    ],
    links: [{ rel: "canonical", href: "/docs/configuration" }],
  }),
  component: () => (
    <Doc
      title="Configuration"
      path="/docs/configuration"
      intro="AWMate is designed to work with minimal setup. Optional configuration lets you refine per-project behaviour."
    >
      <H2>Per-project settings</H2>
      <P>Each project can define ignored paths, preferred commands and workflow preferences.</P>
      <H2>Global settings</H2>
      <P>Application-wide settings live in the AWMate settings panel. Options reflect the actual application configuration; no options are documented that are not supported.</P>
    </Doc>
  ),
});
