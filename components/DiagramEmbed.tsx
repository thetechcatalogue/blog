"use client";

import dynamic from "next/dynamic";
import { getDiagram } from "@/lib/diagrams";

const InteractiveDiagram = dynamic(() => import("./InteractiveDiagram"), {
  ssr: false,
  loading: () => (
    <div
      className="my-8 flex h-[420px] items-center justify-center rounded-xl border"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}
    >
      <p style={{ color: "var(--text-secondary)" }}>Loading interactive diagram...</p>
    </div>
  ),
});

export function Diagram({ name }: { name: string }) {
  const data = getDiagram(name);
  if (!data) {
    return (
      <div className="my-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        Diagram &ldquo;{name}&rdquo; not found. Available: request-flow, event-driven, microservices
      </div>
    );
  }
  return <InteractiveDiagram title={data.title} nodes={data.nodes} edges={data.edges} />;
}
