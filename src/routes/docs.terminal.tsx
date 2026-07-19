import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P, Callout } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/terminal")({
  head: () => ({
    meta: [
      { title: "Terminal commands — AWMate Docs" },
      { name: "description", content: "How AWMate runs approved build, test and development commands on your machine." },
      { property: "og:url", content: "/docs/terminal" },
    ],
    links: [{ rel: "canonical", href: "/docs/terminal" }],
  }),
  component: () => (
    <Doc
      title="Terminal commands"
      path="/docs/terminal"
      intro="AWMate can run approved development, build and testing commands from a chat."
    >
      <H2>Approval flow</H2>
      <P>When AWMate wants to run a command, it shows the exact command and the working directory. You can approve, edit or deny it.</P>
      <H2>Output</H2>
      <P>Command output is streamed back into the chat so AWMate can reason about failures and continue.</P>
      <Callout title="Safety">
        Review commands before approving them, especially anything that installs software or modifies your system beyond the project folder.
      </Callout>
    </Doc>
  ),
});
