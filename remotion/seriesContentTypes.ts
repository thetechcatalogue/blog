import type { Scene } from "@/remotion/types";

/**
 * How an episode gets its video content:
 *   "markdown"    — body of the .md file is parsed into animated scenes
 *   "flow"        — references a named FlowConfig in the flow registry
 *   "composition" — references an existing static video composition by ID
 */
export type EpisodeContentType = "markdown" | "flow" | "composition";

export type EpisodeContent = {
  id: string;
  title: string;
  slug: string;
  order: number;
  description?: string;
  contentType: EpisodeContentType;

  // markdown
  scenes?: Scene[];

  // flow
  flowId?: string;

  // composition
  compositionId?: string;
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
