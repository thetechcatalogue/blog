import { MarkdownVideo } from "./MarkdownVideo";
import { ClientServerFlow } from "./diagrams/ClientServerFlow";
import {
  httpRequestFlow,
  apiAuthFlow,
  incidentTriageFlow,
  safeDeploymentRollbackFlow,
  ragEvaluationFlow,
  websocketLifecycleFlow,
  oauthCodeFlow,
  eventDrivenOrderFlow,
  reactToolUseFlow,
  plannerExecutorFlow,
  multiAgentHandoffFlow,
} from "./diagrams/flows";
import { AgentArchitecture } from "./diagrams/AgentArchitecture";
import { DatabaseTypes } from "./diagrams/DatabaseTypes";
import { CodeMarkerPitch } from "./diagrams/CodeMarkerPitch";
import { DistributedSystemsMap } from "./diagrams/DistributedSystemsMap";
import { McpSecurityBoundary } from "./diagrams/McpSecurityBoundary";
import type { MarkdownVideoContent, VideoCategory } from "./videoContentTypes";

export type VideoDefinition = {
  id: string;
  label: string;
  description: string;
  accentClass: string;
  category: VideoCategory;
  component: React.ComponentType<Record<string, unknown>>;
  inputProps?: Record<string, unknown>;
  durationInFrames: number;
  fps: number;
  compositionWidth: number;
  compositionHeight: number;
};

type BuildVideoCatalogInput = {
  markdownVideos?: MarkdownVideoContent[];
};

export const buildVideoCatalog = ({
  markdownVideos = [],
}: BuildVideoCatalogInput = {}): VideoDefinition[] => {
  const markdownEntries = markdownVideos.map((video) => ({
    id: video.id,
    label: video.label,
    description: video.description,
    accentClass: video.accentClass,
    category: video.category,
    component: MarkdownVideo as React.ComponentType<Record<string, unknown>>,
    inputProps: {
      scenes: video.scenes,
      narrationSrc: video.narrationSrc,
    },
    durationInFrames: video.scenes.reduce((sum, scene) => sum + scene.duration, 0),
    fps: 30,
    compositionWidth: 1920,
    compositionHeight: 1080,
  }));

  return [
    // {
    //   id: "intro",
    //   label: "Hello Remotion",
    //   description: "Simple intro composition",
    //   accentClass: "bg-zinc-700 hover:bg-zinc-600",
    //   component: MyComposition as React.ComponentType<Record<string, unknown>>,
    //   durationInFrames: 90,
    //   fps: 30,
    //   compositionWidth: 1920,
    //   compositionHeight: 1080,
    // },
    ...markdownEntries,
    {
      id: "http-flow",
      label: "HTTP Request Flow",
      description: "Client-server lifecycle",
      accentClass: "bg-emerald-600 hover:bg-emerald-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: httpRequestFlow },
      durationInFrames: 60 + httpRequestFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "api-auth-flow",
      label: "API Auth Flow",
      description: "JWT + refresh token sequence",
      accentClass: "bg-emerald-600 hover:bg-emerald-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: apiAuthFlow },
      durationInFrames: 60 + apiAuthFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "incident-triage-flow",
      label: "Incident Triage Flow",
      description: "Alert validation, mitigation, and follow-up actions",
      accentClass: "bg-emerald-600 hover:bg-emerald-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: incidentTriageFlow },
      durationInFrames: 60 + incidentTriageFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "safe-deployment-and-rollback-flow",
      label: "Safe Deployment and Rollback",
      description: "Canary release with health policies and automatic rollback",
      accentClass: "bg-emerald-600 hover:bg-emerald-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: safeDeploymentRollbackFlow },
      durationInFrames: 60 + safeDeploymentRollbackFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "rag-evaluation-flow",
      label: "RAG Evaluation Flow",
      description: "Test cases, scoring, metrics, and human review",
      accentClass: "bg-amber-600 hover:bg-amber-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: ragEvaluationFlow, narrationSrc: "/audio/videos/rag-evaluation-flow.mp3" },
      durationInFrames: 2700,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "websocket-lifecycle-flow",
      label: "WebSocket Lifecycle",
      description: "Upgrade, messaging, heartbeat, and graceful close",
      accentClass: "bg-emerald-600 hover:bg-emerald-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: websocketLifecycleFlow },
      durationInFrames: 60 + websocketLifecycleFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "oauth-code-flow",
      label: "OAuth 2.0 Auth Code Flow",
      description: "Authorization code with PKCE for third-party login",
      accentClass: "bg-amber-600 hover:bg-amber-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: oauthCodeFlow },
      durationInFrames: 60 + oauthCodeFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "event-driven-order-flow",
      label: "Event-Driven Order Processing",
      description: "CQRS + event sourcing with async projections",
      accentClass: "bg-violet-600 hover:bg-violet-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: eventDrivenOrderFlow },
      durationInFrames: 60 + eventDrivenOrderFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "mcp-security-boundaries",
      label: "MCP Security Boundaries",
      description: "Policy gates, tool scopes, secrets, and audit trails",
      accentClass: "bg-rose-600 hover:bg-rose-500",
      category: "diagrams",
      component: McpSecurityBoundary as React.ComponentType<Record<string, unknown>>,
      inputProps: { narrationSrc: "/audio/videos/mcp-security-boundaries.mp3" },
      durationInFrames: 2700,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "agent-architecture",
      label: "How Agents Work",
      description: "Architecture and runtime blocks",
      accentClass: "bg-violet-600 hover:bg-violet-500",
      category: "diagrams",
      component: AgentArchitecture as React.ComponentType<Record<string, unknown>>,
      inputProps: {
        narrationSrc: "/agent-narration.wav",
        bgmSrc: undefined,
      },
      durationInFrames: 3399,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "database-types",
      label: "Database Types",
      description: "Relational, document, graph and more",
      accentClass: "bg-cyan-600 hover:bg-cyan-500",
      category: "diagrams",
      component: DatabaseTypes as React.ComponentType<Record<string, unknown>>,
      inputProps: {
        narrationSrc: "/databasetypes.mp3",
        bgmSrc: undefined,
      },
      durationInFrames: 8901,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "codemarker",
      label: "CodeMarker Pitch",
      description: "Product story and architecture",
      accentClass: "bg-sky-600 hover:bg-sky-500",
      category: "diagrams",
      component: CodeMarkerPitch as React.ComponentType<Record<string, unknown>>,
      inputProps: {
        narrationSrc: "/codemarker.mp3",
        bgmSrc: undefined,
      },
      durationInFrames: 6308,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "distributed-systems-map",
      label: "Distributed Systems Map",
      description: "Requests, queues, caches, replicas, and failure boundaries",
      accentClass: "bg-fuchsia-600 hover:bg-fuchsia-500",
      category: "diagrams",
      component: DistributedSystemsMap as React.ComponentType<Record<string, unknown>>,
      inputProps: {},
      durationInFrames: 1320,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "react-tool-use-flow",
      label: "ReAct Tool-Use Loop",
      description: "Think → Act → Observe → Repeat",
      accentClass: "bg-emerald-600 hover:bg-emerald-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: reactToolUseFlow },
      durationInFrames: 60 + reactToolUseFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "planner-executor-flow",
      label: "Planner-Executor Pipeline",
      description: "Separate planning from execution",
      accentClass: "bg-emerald-600 hover:bg-emerald-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: plannerExecutorFlow },
      durationInFrames: 60 + plannerExecutorFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "multi-agent-handoff-flow",
      label: "Multi-Agent Handoff",
      description: "Supervisor routes work to specialist agents",
      accentClass: "bg-violet-600 hover:bg-violet-500",
      category: "diagrams",
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: multiAgentHandoffFlow },
      durationInFrames: 60 + multiAgentHandoffFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
  ];
};

export const getVideoById = (
  catalog: VideoDefinition[],
  id: string
): VideoDefinition | undefined => {
  return catalog.find((video) => video.id === id);
};
