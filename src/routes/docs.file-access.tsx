import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/file-access")({
  head: () => ({
    meta: [
      { title: "File context — AWMate Docs" },
      { name: "description", content: "How AWMate reads files inside your project and cites what it accessed." },
      { property: "og:url", content: "/docs/file-access" },
    ],
    links: [{ rel: "canonical", href: "/docs/file-access" }],
  }),
  component: () => (
    <Doc
      title="File context"
      path="/docs/file-access"
      intro="AWMate can inspect relevant source files inside your selected project and reason about the relationships between them."
    >
      <H2>What gets read</H2>
      <P>When you ask a question, AWMate opens only the files it needs to answer. Nothing outside the selected project folder is read.</P>
      <H2>Citations</H2>
      <P>Every response can be traced back to the files AWMate used. This lets you verify claims against your actual code.</P>
      <H2>Excluding files</H2>
      <P>You can exclude sensitive files or folders through project configuration.</P>
    </Doc>
  ),
});
