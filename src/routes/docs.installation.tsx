import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P, OL, UL, Callout } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/installation")({
  head: () => ({
    meta: [
      { title: "Installation — AWMate Docs" },
      { name: "description", content: "Install AWMate Beta on Windows: system requirements and setup steps." },
      { property: "og:url", content: "/docs/installation" },
    ],
    links: [{ rel: "canonical", href: "/docs/installation" }],
  }),
  component: () => (
    <Doc
      title="Installation"
      path="/docs/installation"
      intro="AWMate Beta is distributed as a signed Windows installer through official NxtGenSec releases."
    >
      <H2>System requirements</H2>
      <UL>
        <li>Windows 10 or Windows 11</li>
        <li>64-bit processor</li>
        <li>Approximately 500 MB of free storage</li>
        <li>Internet connection</li>
        <li>Git recommended for the full workflow</li>
      </UL>
      <H2>Steps</H2>
      <OL>
        <li>Download the Windows installer from the Download page.</li>
        <li>Run the installer and follow the prompts.</li>
        <li>If Windows SmartScreen shows a warning, verify the publisher and file source before continuing.</li>
        <li>Launch AWMate from the Start menu.</li>
        <li>Select a project folder to begin.</li>
      </OL>
      <Callout title="Security">
        Do not blindly bypass legitimate SmartScreen or antivirus warnings. Only proceed once
        you have verified the file matches an official NxtGenSec release.
      </Callout>
    </Doc>
  ),
});
