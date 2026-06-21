export const STATIC_VIDEO_IDS = [
  "intro",
  "http-flow",
  "api-auth-flow",
  "mcp-security-boundaries",
  "rag-evaluation-flow",
  "agent-architecture",
  "database-types",
  "codemarker",
  "distributed-systems-map",
] as const;

export const isStaticVideoId = (id: string): boolean => {
  return STATIC_VIDEO_IDS.includes(id as (typeof STATIC_VIDEO_IDS)[number]);
};
