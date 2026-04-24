"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarItem } from "@/lib/content";

export default function Sidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();

  return (
    <aside
      className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r py-6 pr-4 lg:block"
      style={{ borderColor: "var(--border-color)" }}
    >
      <nav className="space-y-1">
        {items.map((item) => (
          <div key={item.href}>
            {item.children ? (
              <div className="mb-2">
                <span
                  className="mb-1 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.title}
                </span>
                <div
                  className="ml-2 space-y-1 border-l pl-3"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block rounded-md px-2 py-1 text-sm transition-colors`}
                      style={
                        pathname === child.href
                          ? { backgroundColor: "var(--accent-light)", color: "var(--accent-hex)", fontWeight: 500 }
                          : { color: "var(--text-secondary)" }
                      }
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                href={item.href}
                className={`block rounded-md px-2 py-1.5 text-sm transition-colors`}
                style={
                  pathname === item.href
                    ? { backgroundColor: "var(--accent-light)", color: "var(--accent-hex)", fontWeight: 500 }
                    : { color: "var(--text-secondary)" }
                }
              >
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
