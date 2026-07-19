import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/chats")({
  head: () => ({
    meta: [
      { title: "Chats and history — AWMate Docs" },
      { name: "description", content: "How AWMate organizes chats per project and preserves conversation context." },
      { property: "og:url", content: "/docs/chats" },
    ],
    links: [{ rel: "canonical", href: "/docs/chats" }],
  }),
  component: () => (
    <Doc
      title="Chats and history"
      path="/docs/chats"
      intro="Every conversation with AWMate lives inside a project. Chats retain context so follow-up questions stay grounded."
    >
      <H2>Starting a chat</H2>
      <P>Open a project and start a new chat. Ask a question, describe a task or paste an error message.</P>
      <H2>Conversation context</H2>
      <P>Within a chat, AWMate remembers earlier turns and the files it has opened. This makes follow-ups shorter and more accurate.</P>
      <H2>Organizing history</H2>
      <P>Chats are grouped by project. You can rename or delete them at any time.</P>
    </Doc>
  ),
});
