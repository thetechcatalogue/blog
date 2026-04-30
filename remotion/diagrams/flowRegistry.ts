import type { FlowConfig } from "./types";
import { httpRequestFlow, apiAuthFlow, sqlQueryFlow } from "./flows";

/**
 * Registry mapping flowId strings (used in episode frontmatter) to FlowConfig objects.
 *
 * To make a new flow available as a series episode:
 *   1. Define the FlowConfig in flows.ts
 *   2. Import it here and add an entry below
 *   3. Reference it in an episode .md with:  flowId: yourKeyName
 */
export const FLOW_REGISTRY: Record<string, FlowConfig> = {
  httpRequestFlow,
  apiAuthFlow,
  sqlQueryFlow,
};
