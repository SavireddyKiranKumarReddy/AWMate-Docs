import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/projects")({
  head: () => ({
    meta: [
      { title: "Selecting a project — AWMate Docs" },
      { name: "description", content: "How to select a project folder in AWMate and manage project scope." },
      { property: "og:url", content: "/docs/projects" },
    ],
    links: [{ rel: "canonical", href: "/docs/projects" }],
  }),
  component: () => (
    <Doc
      title="Selecting a project"
      path="/docs/projects"
      intro="A project in AWMate is a folder on your machine. All file reads and commands are scoped to that folder."
    >
      <H2>Selecting a folder</H2>
      <P>Use the project picker on the AWMate home screen and choose the root folder of the project you want to work on. AWMate builds an understanding of the structure and important files inside that folder.</P>
      <H2>Switching projects</H2>
      <P>You can add multiple projects and switch between them at any time. Each project keeps its own chat history and open questions.</P>
      <H2>Removing a project</H2>
      <P>Removing a project immediately revokes AWMate's access to that folder.</P>
    </Doc>
  ),
});
