export type SceneType =
  | "title"
  | "section"
  | "code"
  | "list"
  | "mermaid"
  | "outro"
  | "image"
  | "quote"
  | "comparison"
  | "timeline"
  | "highlight";

export interface Scene {
  type: SceneType;
  heading: string;
  body?: string;
  code?: string;
  chart?: string;
  language?: string;
  items?: string[];
  imageUrl?: string;
  attribution?: string;
  leftItems?: string[];
  rightItems?: string[];
  leftLabel?: string;
  rightLabel?: string;
  duration: number;
}
