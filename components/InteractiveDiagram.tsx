"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

/* ─── Node data shape ─── */
export interface ArchNode {
  id: string;
  label: string;
  description: string;
  icon?: string; // emoji
  x: number;
  y: number;
  type?: "default" | "input" | "output";
  style?: "primary" | "secondary" | "accent" | "warning" | "success";
}

export interface ArchEdge {
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface ArchDiagramProps {
  title: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

/* ─── Color mapping per style ─── */
const styleColors: Record<string, { bg: string; border: string; text: string }> = {
  primary:   { bg: "var(--bg-secondary)", border: "var(--accent-hex)", text: "var(--text-primary)" },
  secondary: { bg: "var(--bg-secondary)", border: "var(--border-color)", text: "var(--text-primary)" },
  accent:    { bg: "var(--accent-light)", border: "var(--accent-hex)", text: "var(--text-primary)" },
  warning:   { bg: "#fef3c7",            border: "#f59e0b",           text: "#92400e" },
  success:   { bg: "#d1fae5",            border: "#10b981",           text: "#065f46" },
};

/* ─── Custom node component ─── */
function ArchitectureNode({ data }: { data: { label: string; icon?: string; description: string; nodeStyle: string; selected: boolean } }) {
  const colors = styleColors[data.nodeStyle] || styleColors.secondary;

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: colors.border }} />
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: colors.border }} />
      <div
        className="rounded-xl px-4 py-3 shadow-md transition-all duration-200"
        style={{
          backgroundColor: colors.bg,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: data.selected ? "var(--accent-hex)" : colors.border,
          minWidth: 140,
          transform: data.selected ? "scale(1.05)" : "scale(1)",
          boxShadow: data.selected
            ? `0 0 0 3px rgb(var(--accent) / 0.2), 0 8px 25px -5px rgba(0,0,0,0.15)`
            : "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-center gap-2">
          {data.icon && <span className="text-xl">{data.icon}</span>}
          <span className="text-sm font-semibold" style={{ color: colors.text }}>
            {data.label}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: colors.border }} />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: colors.border }} />
    </>
  );
}

const nodeTypes: NodeTypes = {
  architecture: ArchitectureNode,
};

/* ─── Main diagram component ─── */
export default function InteractiveDiagram({ title, nodes: archNodes, edges: archEdges }: ArchDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);

  const initialNodes: Node[] = archNodes.map((n) => ({
    id: n.id,
    type: "architecture",
    position: { x: n.x, y: n.y },
    data: {
      label: n.label,
      icon: n.icon,
      description: n.description,
      nodeStyle: n.style || "secondary",
      selected: false,
    },
  }));

  const initialEdges: Edge[] = archEdges.map((e, i) => ({
    id: `e-${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.animated ?? false,
    style: { stroke: "var(--accent-hex)", strokeWidth: 2 },
    labelStyle: { fill: "var(--text-secondary)", fontSize: 11, fontWeight: 500 },
    labelBgStyle: { fill: "var(--bg)", fillOpacity: 0.85 },
    labelBgPadding: [6, 3] as [number, number],
    labelBgBorderRadius: 4,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const arch = archNodes.find((n) => n.id === node.id);
      setSelectedNode(arch || null);

      // Highlight selected node
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: { ...n.data, selected: n.id === node.id },
        }))
      );
    },
    [archNodes, setNodes]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, selected: false },
      }))
    );
  }, [setNodes]);

  return (
    <div className="not-prose my-8 rounded-xl border overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
      {/* Header */}
      <div
        className="flex flex-col gap-1 border-b px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          🔍 {title}
        </h3>
        <span className="hidden text-xs sm:inline" style={{ color: "var(--text-secondary)" }}>
          Click a component to explore • Drag to pan • Scroll to zoom
        </span>
        <span className="text-xs sm:hidden" style={{ color: "var(--text-secondary)" }}>
          Tap to explore • Pinch to zoom
        </span>
      </div>

      {/* Diagram canvas */}
      <div className="h-[300px] sm:h-[420px]" style={{ backgroundColor: "var(--bg-tertiary)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
        >
          <Background color="var(--border-color)" gap={20} size={1} />
          <Controls
            showInteractive={false}
            className="!bg-[var(--bg)] !border-[var(--border-color)] !shadow-lg [&>button]:!bg-[var(--bg)] [&>button]:!border-[var(--border-color)] [&>button]:!fill-[var(--text-secondary)] [&>button:hover]:!bg-[var(--bg-secondary)]"
          />
        </ReactFlow>
      </div>

      {/* Detail panel — below canvas on mobile, beside on desktop */}
      <div
        className="border-t p-4"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg)",
          minHeight: 80,
        }}
      >
        {selectedNode ? (
          <div className="animate-in">
            <div className="mb-2 flex items-center gap-2">
              {selectedNode.icon && <span className="text-2xl">{selectedNode.icon}</span>}
              <h4 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {selectedNode.label}
              </h4>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {selectedNode.description}
            </p>
          </div>
        ) : (
          <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            👆 Tap any component in the diagram to see its details
          </p>
        )}
      </div>
    </div>
  );
}
