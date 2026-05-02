import { MarkdownVideo } from "@/remotion/MarkdownVideo";
import { ClientServerFlow } from "@/remotion/diagrams/ClientServerFlow";
import {
  httpRequestFlow,
  apiAuthFlow,
  incidentTriageFlow,
  safeDeploymentRollbackFlow,
} from "@/remotion/diagrams/flows";
import { AgentArchitecture } from "@/remotion/diagrams/AgentArchitecture";
import { DatabaseTypes } from "@/remotion/diagrams/DatabaseTypes";
import { CodeMarkerPitch } from "@/remotion/diagrams/CodeMarkerPitch";
import { DistributedSystemsMap } from "@/remotion/diagrams/DistributedSystemsMap";
import type { MarkdownVideoContent } from "@/remotion/videoContentTypes";

export type VideoDefinition = {
  id: string;
  label: string;
  description: string;
  accentClass: string;
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
      component: ClientServerFlow as React.ComponentType<Record<string, unknown>>,
      inputProps: { config: safeDeploymentRollbackFlow },
      durationInFrames: 60 + safeDeploymentRollbackFlow.steps.length * 60,
      fps: 30,
      compositionWidth: 1920,
      compositionHeight: 1080,
    },
    {
      id: "agent-architecture",
      label: "How Agents Work",
      description: "Architecture and runtime blocks",
      accentClass: "bg-violet-600 hover:bg-violet-500",
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
      component: DistributedSystemsMap as React.ComponentType<Record<string, unknown>>,
      inputProps: {},
      durationInFrames: 1320,
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
