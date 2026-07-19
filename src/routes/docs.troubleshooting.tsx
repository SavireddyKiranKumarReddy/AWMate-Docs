import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P, UL } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/troubleshooting")({
  head: () => ({
    meta: [
      { title: "Troubleshooting — AWMate Docs" },
      { name: "description", content: "Fixes for common AWMate issues on Windows." },
      { property: "og:url", content: "/docs/troubleshooting" },
    ],
    links: [{ rel: "canonical", href: "/docs/troubleshooting" }],
  }),
  component: () => (
    <Doc
      title="Troubleshooting"
      path="/docs/troubleshooting"
      intro="Solutions to the most common issues you might run into with AWMate on Windows."
    >
      <H2>Installer is blocked by SmartScreen</H2>
      <P>Verify that the file comes from an official NxtGenSec release before continuing. Do not bypass legitimate security warnings without confirmation.</P>
      <H2>AWMate cannot see a file</H2>
      <UL>
        <li>Confirm the file is inside the currently selected project folder.</li>
        <li>Check whether the path is excluded by project configuration.</li>
      </UL>
      <H2>A command fails to run</H2>
      <UL>
        <li>Ensure the required tool (for example Node.js, Python, Git) is installed and on your PATH.</li>
        <li>Try running the command manually to confirm it works outside AWMate.</li>
      </UL>
    </Doc>
  ),
});
