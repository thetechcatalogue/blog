/**
 * Server-safe video metadata — NO Remotion component imports.
 *
 * This file is safe to import from Next.js Server Components.
 * It contains only static strings/numbers needed for generateMetadata
 * and notFound() checks. The full VideoDefinition (with component
 * references) lives in videoCatalog.ts which must stay client-only.
 */
import type { MarkdownVideoContent, VideoCategory } from "./videoContentTypes";

export type VideoMeta = {
  id: string;
  label: string;
  description: string;
  accentClass: string;
  category: VideoCategory;
};

/** Static video IDs that are NOT driven by markdown files. */
const STATIC_VIDEO_METAS: VideoMeta[] = [
  {
    id: "http-flow",
    label: "HTTP Request Flow",
    description: "Client-server lifecycle",
    accentClass: "bg-emerald-600 hover:bg-emerald-500",
    category: "diagrams",
  },
  {
    id: "api-auth-flow",
    label: "API Auth Flow",
    description: "JWT + refresh token sequence",
    accentClass: "bg-emerald-600 hover:bg-emerald-500",
    category: "diagrams",
  },
  {
    id: "incident-triage-flow",
    label: "Incident Triage Flow",
    description: "Alert validation, mitigation, and follow-up actions",
    accentClass: "bg-emerald-600 hover:bg-emerald-500",
    category: "diagrams",
  },
  {
    id: "safe-deployment-and-rollback-flow",
    label: "Safe Deployment and Rollback",
    description: "Canary release with health policies and automatic rollback",
    accentClass: "bg-emerald-600 hover:bg-emerald-500",
    category: "diagrams",
  },
  {
    id: "rag-evaluation-flow",
    label: "RAG Evaluation Flow",
    description: "Test cases, scoring, metrics, and human review",
    accentClass: "bg-amber-600 hover:bg-amber-500",
    category: "diagrams",
  },
  {
    id: "websocket-lifecycle-flow",
    label: "WebSocket Lifecycle",
    description: "Upgrade, messaging, heartbeat, and graceful close",
    accentClass: "bg-emerald-600 hover:bg-emerald-500",
    category: "diagrams",
  },
  {
    id: "oauth-code-flow",
    label: "OAuth 2.0 Auth Code Flow",
    description: "Authorization code with PKCE for third-party login",
    accentClass: "bg-amber-600 hover:bg-amber-500",
    category: "diagrams",
  },
  {
    id: "event-driven-order-flow",
    label: "Event-Driven Order Processing",
    description: "CQRS + event sourcing with async projections",
    accentClass: "bg-violet-600 hover:bg-violet-500",
    category: "diagrams",
  },
  {
    id: "mcp-security-boundaries",
    label: "MCP Security Boundaries",
    description: "Policy gates, tool scopes, secrets, and audit trails",
    accentClass: "bg-rose-600 hover:bg-rose-500",
    category: "diagrams",
  },
  {
    id: "agent-architecture",
    label: "How Agents Work",
    description: "Architecture and runtime blocks",
    accentClass: "bg-violet-600 hover:bg-violet-500",
    category: "diagrams",
  },
  {
    id: "database-types",
    label: "Database Types",
    description: "Relational, document, graph and more",
    accentClass: "bg-cyan-600 hover:bg-cyan-500",
    category: "diagrams",
  },
  {
    id: "codemarker",
    label: "CodeMarker Pitch",
    description: "Product story and architecture",
    accentClass: "bg-sky-600 hover:bg-sky-500",
    category: "diagrams",
  },
  {
    id: "distributed-systems-map",
    label: "Distributed Systems Map",
    description: "Requests, queues, caches, replicas, and failure boundaries",
    accentClass: "bg-fuchsia-600 hover:bg-fuchsia-500",
    category: "diagrams",
  },
  {
    id: "react-tool-use-flow",
    label: "ReAct Tool-Use Loop",
    description: "Think → Act → Observe → Repeat",
    accentClass: "bg-emerald-600 hover:bg-emerald-500",
    category: "diagrams",
  },
  {
    id: "planner-executor-flow",
    label: "Planner-Executor Pipeline",
    description: "Separate planning from execution",
    accentClass: "bg-emerald-600 hover:bg-emerald-500",
    category: "diagrams",
  },
  {
    id: "multi-agent-handoff-flow",
    label: "Multi-Agent Handoff",
    description: "Supervisor routes work to specialist agents",
    accentClass: "bg-violet-600 hover:bg-violet-500",
    category: "diagrams",
  },
];

type BuildVideoMetaInput = {
  markdownVideos?: MarkdownVideoContent[];
};

export const buildVideoMeta = ({
  markdownVideos = [],
}: BuildVideoMetaInput = {}): VideoMeta[] => {
  const markdownMetas: VideoMeta[] = markdownVideos.map((v) => ({
    id: v.id,
    label: v.label,
    description: v.description,
    accentClass: v.accentClass,
    category: v.category,
  }));
  return [...markdownMetas, ...STATIC_VIDEO_METAS];
};

export const getVideoMetaById = (
  catalog: VideoMeta[],
  id: string
): VideoMeta | undefined => catalog.find((v) => v.id === id);
