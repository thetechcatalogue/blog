import type { Scene } from "@/remotion/types";

export type MarkdownVideoContent = {
  id: string;
  label: string;
  description: string;
  accentClass: string;
  order: number;
  scenes: Scene[];
  narrationSrc?: string;
  audioDurationSec?: number;
};
