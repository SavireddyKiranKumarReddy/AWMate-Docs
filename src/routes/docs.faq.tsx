import { createFileRoute } from "@tanstack/react-router";
import { Doc, H2, P } from "@/components/site/Doc";

export const Route = createFileRoute("/docs/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — AWMate Docs" },
      { name: "description", content: "Frequently asked questions about AWMate Beta." },
      { property: "og:url", content: "/docs/faq" },
    ],
    links: [{ rel: "canonical", href: "/docs/faq" }],
  }),
  component: () => (
    <Doc
      title="FAQ"
      path="/docs/faq"
      intro="Answers to the questions we hear most often about AWMate Beta."
    >
      <H2>Is AWMate available on macOS or Linux?</H2>
      <P>AWMate Beta ships for Windows. Other platforms are not currently supported.</P>
      <H2>Does AWMate upload my code?</H2>
      <P>Files are read locally inside the selected project. Only the information necessary to answer your questions is sent to complete a request.</P>
      <H2>Can I use AWMate on production systems?</H2>
      <P>Review code and commands before running them in production. AWMate is an assistant, not an unattended agent.</P>
      <H2>Who builds AWMate?</H2>
      <P>AWMate is built by NxtGenSec (Next Generation Security).</P>
    </Doc>
  ),
});
