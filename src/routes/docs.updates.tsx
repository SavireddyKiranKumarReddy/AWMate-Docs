import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/updates")({
  head: () => ({
    meta: [
      { title: "Updates — AWMate Docs" },
      { name: "description", content: "How AWMate is updated: signed releases, changelogs and on-your-schedule installation." },
      { property: "og:url", content: "/docs/updates" },
    ],
    links: [{ rel: "canonical", href: "/docs/updates" }],
  }),
  component: () => (
    <Doc
      title="Updates"
      path="/docs/updates"
      intro="AWMate ships regular updates through signed releases. You choose when to install a new version."
    >
      <H2>Release channel</H2>
      <P>Public builds are published as GitHub releases under the official NxtGenSec organization. The Download page and Changelog always point to the latest version.</P>
      <H2>Installing an update</H2>
      <P>Download the new installer and run it. Existing projects and chats remain intact.</P>
    </Doc>
  ),
});
