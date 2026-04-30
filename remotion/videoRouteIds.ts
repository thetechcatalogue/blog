export const STATIC_VIDEO_IDS = [
  "intro",
  "http-flow",
  "api-auth-flow",
  "agent-architecture",
  "database-types",
  "codemarker",
] as const;

export const isStaticVideoId = (id: string): boolean => {
  return STATIC_VIDEO_IDS.includes(id as (typeof STATIC_VIDEO_IDS)[number]);
};
