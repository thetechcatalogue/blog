"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TableOfContents from "@/components/TableOfContents";
import type { SidebarItem } from "@/lib/content";

export default function DocsShell({
  sidebar,
  children,
}: {
  sidebar: SidebarItem[];
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-[90rem] px-6">
      <Sidebar items={sidebar} mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 flex-1 py-8 lg:pl-8">
        {/* Mobile sidebar toggle */}
        <button
          className="mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium lg:hidden"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            backgroundColor: "var(--card-bg)",
          }}
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>

        <article className="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-20">
          {children}
        </article>
      </main>
      <div className="hidden xl:block xl:pl-8">
        <TableOfContents />
      </div>
    </div>
  );
}
