import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/git")({
  head: () => ({
    meta: [
      { title: "Git assistance — AWMate Docs" },
      { name: "description", content: "How AWMate helps with git workflows: diffs, commit messages and safe recovery." },
      { property: "og:url", content: "/docs/git" },
    ],
    links: [{ rel: "canonical", href: "/docs/git" }],
  }),
  component: () => (
    <Doc
      title="Git assistance"
      path="/docs/git"
      intro="AWMate helps you reason about branches, diffs and commit messages, while keeping destructive operations gated behind your approval."
    >
      <H2>Diff review</H2>
      <P>Ask AWMate to summarize a diff or explain a change set. It reads the diff and produces a plain-language walkthrough.</P>
      <H2>Commit messages</H2>
      <P>AWMate can draft commit messages based on the staged changes. You can edit or replace the draft before committing.</P>
      <H2>Recovery</H2>
      <P>For destructive operations (force push, reset, branch delete), AWMate asks for explicit approval and suggests safe alternatives when possible.</P>
    </Doc>
  ),
});
