import type { Scene } from "@/remotion/types";

export type VideoCategory = "ai" | "engineering" | "diagrams";

export type MarkdownVideoContent = {
  id: string;
  label: string;
  description: string;
  accentClass: string;
  category: VideoCategory;
  order: number;
  scenes: Scene[];
  narrationSrc?: string;
  audioDurationSec?: number;
};
