import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface Block {
  id: string;
  label: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
  appearAt: number;
}

interface Connection {
  from: string;
  to: string;
  label: string;
  appearAt: number;
  color: string;
}

const BLOCKS: Block[] = [
  // Center: Agent Core
  {
    id: "agent",
    label: "Agent Core",
    icon: "🤖",
    color: "#6366f1",
    x: 810,
    y: 420,
    width: 300,
    height: 100,
    description: "Orchestrates reasoning & actions",
    appearAt: 0,
  },
  // Top: User / Prompt
  {
    id: "user",
    label: "User Prompt",
    icon: "💬",
    color: "#60a5fa",
    x: 860,
    y: 120,
    width: 200,
    height: 80,
    description: "Natural language input",
    appearAt: 240,
  },
  // Left side: Knowledge
  {
    id: "memory",
    label: "Memory",
    icon: "🧠",
    color: "#f472b6",
    x: 160,
    y: 260,
    width: 200,
    height: 80,
    description: "Short & long-term context",
    appearAt: 450,
  },
  {
    id: "knowledge",
    label: "Knowledge Base",
    icon: "📚",
    color: "#fb923c",
    x: 160,
    y: 400,
    width: 200,
    height: 80,
    description: "RAG / Vector search",
    appearAt: 660,
  },
  {
    id: "skills",
    label: "Skills",
    icon: "⚡",
    color: "#a78bfa",
    x: 160,
    y: 540,
    width: 200,
    height: 80,
    description: "Specialized capabilities",
    appearAt: 870,
  },
  // Right side: Actions
  {
    id: "tools",
    label: "Tools / APIs",
    icon: "🔧",
    color: "#34d399",
    x: 1560,
    y: 260,
    width: 200,
    height: 80,
    description: "External service calls",
    appearAt: 1080,
  },
  {
    id: "hooks",
    label: "Hooks",
    icon: "🪝",
    color: "#fbbf24",
    x: 1560,
    y: 400,
    width: 200,
    height: 80,
    description: "Pre/post processing steps",
    appearAt: 1290,
  },
  {
    id: "output",
    label: "Output / Response",
    icon: "📤",
    color: "#2dd4bf",
    x: 1560,
    y: 540,
    width: 200,
    height: 80,
    description: "Structured result",
    appearAt: 1500,
  },
  // Bottom: Planning
  {
    id: "planner",
    label: "Planner / ReAct",
    icon: "🗺️",
    color: "#e879f9",
    x: 640,
    y: 620,
    width: 200,
    height: 80,
    description: "Think → Act → Observe loop",
    appearAt: 1710,
  },
  {
    id: "prompt",
    label: "Prompt Structure",
    icon: "📋",
    color: "#f87171",
    x: 1080,
    y: 620,
    width: 200,
    height: 80,
    description: "System + context + instructions",
    appearAt: 1920,
  },
];

const CONNECTIONS: Connection[] = [
  { from: "user", to: "agent", label: "Input", appearAt: 2160, color: "#60a5fa" },
  { from: "agent", to: "memory", label: "Recall", appearAt: 2250, color: "#f472b6" },
  { from: "memory", to: "agent", label: "Context", appearAt: 2340, color: "#f472b6" },
  { from: "agent", to: "knowledge", label: "Search", appearAt: 2430, color: "#fb923c" },
  { from: "agent", to: "skills", label: "Invoke", appearAt: 2520, color: "#a78bfa" },
  { from: "agent", to: "tools", label: "Call", appearAt: 2610, color: "#34d399" },
  { from: "tools", to: "agent", label: "Result", appearAt: 2700, color: "#34d399" },
  { from: "agent", to: "hooks", label: "Trigger", appearAt: 2790, color: "#fbbf24" },
  { from: "planner", to: "agent", label: "Next step", appearAt: 2880, color: "#e879f9" },
  { from: "prompt", to: "agent", label: "Instructions", appearAt: 2970, color: "#f87171" },
  { from: "agent", to: "output", label: "Respond", appearAt: 3060, color: "#2dd4bf" },
];

function getBlockCenter(block: Block) {
  return { x: block.x + block.width / 2, y: block.y + block.height / 2 };
}

export const AgentArchitecture: React.FC<{
  narrationSrc?: string;
  bgmSrc?: string;
}> = ({ narrationSrc, bgmSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleScale = spring({ fps, frame, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing glow on agent core
  const pulsePhase = Math.sin(frame * 0.08) * 0.5 + 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Narration audio */}
      {narrationSrc && (
        <Audio src={narrationSrc} volume={1} />
      )}
      {/* Background music — low volume */}
      {bgmSrc && (
        <Audio src={bgmSrc} volume={0.12} />
      )}

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${titleScale})`,
        }}
      >
        <div style={{ color: "#fff", fontSize: 38, fontWeight: 700 }}>
          How AI Agents Work
        </div>
        <div style={{ color: "#6366f1", fontSize: 18, marginTop: 4, opacity: subtitleOpacity }}>
          Architecture & Component Flow
        </div>
      </div>

      {/* SVG layer for connections */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {CONNECTIONS.map((conn, i) => {
          const fromBlock = BLOCKS.find((b) => b.id === conn.from)!;
          const toBlock = BLOCKS.find((b) => b.id === conn.to)!;
          const from = getBlockCenter(fromBlock);
          const to = getBlockCenter(toBlock);

          const progress = interpolate(
            frame,
            [conn.appearAt, conn.appearAt + 30],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          if (progress <= 0) return null;

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const currentLen = len * progress;

          // Arrowhead position
          const endX = from.x + (dx / len) * currentLen;
          const endY = from.y + (dy / len) * currentLen;

          return (
            <g key={i} opacity={progress}>
              {/* Line */}
              <line
                x1={from.x}
                y1={from.y}
                x2={endX}
                y2={endY}
                stroke={conn.color}
                strokeWidth={2.5}
                strokeDasharray={progress >= 1 ? "none" : "6 4"}
                opacity={0.7}
              />
              {/* Moving dot */}
              {progress < 1 && (
                <circle
                  cx={endX}
                  cy={endY}
                  r={5}
                  fill={conn.color}
                />
              )}
              {/* Label at midpoint */}
              {progress >= 0.5 && (
                <>
                  <rect
                    x={(from.x + to.x) / 2 - 40}
                    y={(from.y + to.y) / 2 - 12}
                    width={80}
                    height={22}
                    rx={6}
                    fill="#0a0a1a"
                    fillOpacity={0.9}
                  />
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 + 3}
                    textAnchor="middle"
                    fill={conn.color}
                    fontSize={12}
                    fontWeight={600}
                    fontFamily="system-ui, sans-serif"
                    opacity={interpolate(progress, [0.5, 0.8], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })}
                  >
                    {conn.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Blocks */}
      {BLOCKS.map((block) => {
        const blockSpring = spring({
          fps,
          frame: frame - block.appearAt,
          config: { damping: 14 },
        });
        const scale = interpolate(blockSpring, [0, 1], [0.3, 1]);
        const opacity = interpolate(blockSpring, [0, 1], [0, 1]);

        const isAgent = block.id === "agent";
        const glowOpacity = isAgent ? pulsePhase * 0.4 : 0;

        return (
          <div
            key={block.id}
            style={{
              position: "absolute",
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height,
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            {/* Glow effect for agent core */}
            {isAgent && (
              <div
                style={{
                  position: "absolute",
                  inset: -8,
                  borderRadius: 20,
                  backgroundColor: block.color,
                  opacity: glowOpacity,
                  filter: "blur(16px)",
                }}
              />
            )}
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: block.color + "18",
                border: `2px solid ${block.color}`,
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div style={{ fontSize: isAgent ? 32 : 26 }}>{block.icon}</div>
              <div
                style={{
                  color: block.color,
                  fontSize: isAgent ? 20 : 16,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {block.label}
              </div>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: 11,
                  marginTop: 2,
                  opacity: interpolate(
                    frame,
                    [block.appearAt + 20, block.appearAt + 40],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ),
                }}
              >
                {block.description}
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 24,
          opacity: interpolate(frame, [3150, 3180], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {[
          { label: "Knowledge", color: "#f472b6" },
          { label: "Reasoning", color: "#e879f9" },
          { label: "Actions", color: "#34d399" },
          { label: "I/O", color: "#60a5fa" },
        ].map((item) => (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />
            <span style={{ color: "#9ca3af", fontSize: 13 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
