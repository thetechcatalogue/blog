"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { SidebarItem } from "@/lib/content";

function SidebarNav({ items, pathname }: { items: SidebarItem[]; pathname: string }) {
  return (
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
                    className="block rounded-md px-2 py-1 text-sm transition-colors"
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
              className="block rounded-md px-2 py-1.5 text-sm transition-colors"
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
  );
}

export default function Sidebar({
  items,
  mobileOpen,
  onMobileClose,
}: {
  items: SidebarItem[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  // Close drawer on navigation
  useEffect(() => {
    onMobileClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r py-6 pr-4 lg:block"
        style={{ borderColor: "var(--border-color)" }}
      >
        <SidebarNav items={items} pathname={pathname} />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 h-full w-72 overflow-y-auto p-6 shadow-xl"
            style={{ backgroundColor: "var(--bg)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Navigation
              </span>
              <button
                onClick={onMobileClose}
                aria-label="Close sidebar"
                style={{ color: "var(--text-secondary)" }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarNav items={items} pathname={pathname} />
          </aside>
        </div>
      )}
    </>
  );
}
