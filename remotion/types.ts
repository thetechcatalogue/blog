export type SceneType = "title" | "section" | "code" | "list" | "outro";

export interface Scene {
  type: SceneType;
  heading: string;
  body?: string;
  code?: string;
  language?: string;
  items?: string[];
  duration: number;
}
