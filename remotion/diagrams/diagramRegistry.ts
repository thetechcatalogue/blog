import { ReflexAgentDiagram } from "./ReflexAgentDiagram";
import { ToolUseAgentDiagram } from "./ToolUseAgentDiagram";
import { PlanningAgentDiagram } from "./PlanningAgentDiagram";
import { MemoryAgentDiagram } from "./MemoryAgentDiagram";
import { MultiAgentDiagram } from "./MultiAgentDiagram";
import { AutonomousAgentDiagram } from "./AutonomousAgentDiagram";
import { AgentTypesOverview } from "./AgentTypesOverview";

/**
 * Registry mapping diagramId strings (used in episode frontmatter) to React components.
 *
 * Each component renders a full 1920×1080 animated diagram using Remotion's
 * useCurrentFrame() / spring() / interpolate() hooks. Components scale their
 * internal timing to useVideoConfig().durationInFrames so they fill any duration.
 *
 * To add a new animated diagram:
 *   1. Create the component in remotion/diagrams/YourDiagram.tsx
 *   2. Import it here and add an entry below
 *   3. Reference it in an episode .md with:  diagramId: yourKey
 */
export const DIAGRAM_REGISTRY: Record<string, React.ComponentType> = {
  agentTypesOverview: AgentTypesOverview,
  reflexAgent:     ReflexAgentDiagram,
  toolUseAgent:    ToolUseAgentDiagram,
  planningAgent:   PlanningAgentDiagram,
  memoryAgent:     MemoryAgentDiagram,
  multiAgent:      MultiAgentDiagram,
  autonomousAgent: AutonomousAgentDiagram,
};
