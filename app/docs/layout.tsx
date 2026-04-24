import Sidebar from "@/components/Sidebar";
import { buildSidebar } from "@/lib/content";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sidebar = buildSidebar("docs");

  return (
    <div className="mx-auto flex max-w-7xl px-6">
      <Sidebar items={sidebar} />
      <main className="min-w-0 flex-1 py-8 lg:pl-8">
        <article className="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-20">
          {children}
        </article>
      </main>
    </div>
  );
}
