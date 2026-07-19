import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/tools")({
  head: () => ({
    meta: [
      { title: "Code changes & tools — AWMate Docs" },
      { name: "description", content: "How AWMate proposes and applies scoped code changes across your project." },
      { property: "og:url", content: "/docs/tools" },
    ],
    links: [{ rel: "canonical", href: "/docs/tools" }],
  }),
  component: () => (
    <Doc
      title="Code changes and tools"
      path="/docs/tools"
      intro="AWMate proposes changes as diffs. You approve, edit or reject each change before anything is written."
    >
      <H2>Proposing changes</H2>
      <P>Describe what you want. AWMate breaks the task into scoped edits and presents them as a reviewable set.</P>
      <H2>Reviewing changes</H2>
      <P>Every file that will be modified is shown as a diff. You can approve individual hunks or the whole set.</P>
      <H2>Reverting changes</H2>
      <P>Applied changes remain visible in chat history so you can revert them through git or by asking AWMate to undo.</P>
    </Doc>
  ),
});
