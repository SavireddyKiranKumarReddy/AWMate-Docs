import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P, UL } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/getting-started")({
  head: () => ({
    meta: [
      { title: "Introduction — AWMate Docs" },
      { name: "description", content: "Introduction to AWMate Beta, the assistive workmate for software engineering." },
      { property: "og:url", content: "/docs/getting-started" },
    ],
    links: [{ rel: "canonical", href: "/docs/getting-started" }],
  }),
  component: () => (
    <Doc
      title="Introduction"
      path="/docs/getting-started"
      intro="AWMate is a professional AI assistive workmate for software engineering and productivity, powered by NxtGenSec. This section explains what AWMate is and how to get started."
    >
      <H2>What AWMate is</H2>
      <P>
        AWMate is a Windows desktop application that helps you understand, build, debug and
        improve software projects. It runs on your machine, reads only the folder you select
        and requires your approval before writing files or running commands.
      </P>
      <H2>What you can do with it</H2>
      <UL>
        <li>Ask questions about an unfamiliar codebase and get grounded answers.</li>
        <li>Have AWMate propose scoped, reviewable code changes across files.</li>
        <li>Run approved build and test commands from a chat.</li>
        <li>Get help drafting commit messages and reasoning about diffs.</li>
      </UL>
      <H2>Next steps</H2>
      <UL>
        <li>Install AWMate on Windows.</li>
        <li>Select a project folder.</li>
        <li>Start your first chat.</li>
      </UL>
    </Doc>
  ),
});
