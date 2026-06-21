import type { Scene } from "@/remotion/types";

/**
 * How an episode gets its video content:
 *   "markdown"    — body of the .md file is parsed into animated scenes
 *   "flow"        — references a named FlowConfig in the flow registry
 *   "composition" — references an existing static video composition by ID
 *   "diagram"     — references a named animated diagram component in the diagram registry
 */
export type EpisodeContentType = "markdown" | "flow" | "composition" | "diagram";

export type EpisodeContent = {
  id: string;
  title: string;
  slug: string;
  order: number;
  description?: string;
  contentType: EpisodeContentType;
  narrationSrc?: string;
  audioDurationSec?: number;

  // markdown
  scenes?: Scene[];

  // flow
  flowId?: string;

  // composition
  compositionId?: string;

  // diagram
  diagramId?: string;
};

export type SeriesContent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  accentClass: string;
  order: number;
  episodes: EpisodeContent[];
};
