import { buildSidebar } from "@/lib/content";
import DocsShell from "./DocsShell";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sidebar = buildSidebar("docs");

  return <DocsShell sidebar={sidebar}>{children}</DocsShell>;
}
