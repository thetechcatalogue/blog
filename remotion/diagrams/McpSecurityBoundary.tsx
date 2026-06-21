import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type NodeSpec = {
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
};

type ArrowSpec = {
  from: string;
  to: string;
  label: string;
  color: string;
  appearAt: number;
  dashed?: boolean;
};

const NODES: NodeSpec[] = [
  {
    id: "client",
    label: "Client App",
    icon: "💻",
    color: "#60a5fa",
    x: 120,
    y: 280,
    width: 220,
    height: 92,
    description: "Sends user prompts and context",
    appearAt: 0,
  },
  {
    id: "policy",
    label: "Policy Gate",
    icon: "🛡️",
    color: "#f59e0b",
    x: 420,
    y: 180,
    width: 220,
    height: 92,
    description: "Checks scope, allow-list, and tenancy",
    appearAt: 150,
  },
  {
    id: "server",
    label: "MCP Server",
    icon: "🔌",
    color: "#34d399",
    x: 690,
    y: 280,
    width: 240,
    height: 104,
    description: "Owns runtime, tool selection, and tracing",
    appearAt: 300,
  },
  {
    id: "tools",
    label: "Allowed Tools",
    icon: "🧰",
    color: "#a78bfa",
    x: 990,
    y: 160,
    width: 230,
    height: 92,
    description: "Explicit tool contracts only",
    appearAt: 450,
  },
  {
    id: "host",
    label: "Resource Host",
    icon: "🏗️",
    color: "#2dd4bf",
    x: 990,
    y: 360,
    width: 230,
    height: 92,
    description: "Backend APIs, files, and databases",
    appearAt: 600,
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: "📒",
    color: "#f472b6",
    x: 690,
    y: 460,
    width: 240,
    height: 92,
    description: "Records every decision and tool call",
    appearAt: 750,
  },
  {
    id: "secrets",
    label: "Secrets Vault",
    icon: "🔐",
    color: "#ef4444",
    x: 420,
    y: 470,
    width: 220,
    height: 92,
    description: "Server-side credentials only",
    appearAt: 900,
  },
];

const ARROWS: ArrowSpec[] = [
  { from: "client", to: "policy", label: "Request", color: "#60a5fa", appearAt: 150 },
  { from: "policy", to: "server", label: "Allow scoped call", color: "#34d399", appearAt: 330 },
  { from: "server", to: "tools", label: "Approved tool", color: "#a78bfa", appearAt: 510 },
  { from: "tools", to: "host", label: "Read / write", color: "#2dd4bf", appearAt: 660 },
  { from: "server", to: "audit", label: "Trace", color: "#f472b6", appearAt: 810 },
  { from: "policy", to: "audit", label: "Allow / deny", color: "#f59e0b", appearAt: 930 },
  { from: "policy", to: "secrets", label: "Blocked direct access", color: "#ef4444", appearAt: 1080, dashed: true },
];

const POLICY_PILLS = [
  "allow-list",
  "scope",
  "workspace id",
  "tenant",
  "audit trail",
];

function center(node: NodeSpec) {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

export const McpSecurityBoundary: React.FC<{
  narrationSrc?: string;
}> = ({ narrationSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ fps, frame, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = Math.sin(frame * 0.05) * 0.5 + 0.5;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at top, rgba(15,23,42,0.95), rgba(2,6,23,1) 58%)",
        fontFamily: "system-ui, sans-serif",
        color: "#f8fafc",
      }}
    >
      {narrationSrc && <Audio src={narrationSrc} volume={1} />}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${titleScale})`,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800 }}>MCP Server Security and Permission Boundaries</div>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 18,
            marginTop: 6,
            opacity: subtitleOpacity,
          }}
        >
          Every tool call passes through policy before it reaches the server or its resources.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          top: 150,
          width: 310,
          height: 540,
          border: "1.5px dashed rgba(96,165,250,0.45)",
          borderRadius: 24,
          background: "rgba(15,23,42,0.25)",
        }}
      >
        <div style={{ position: "absolute", top: 14, left: 18, color: "#60a5fa", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
          Untrusted Input
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 390,
          top: 120,
          width: 840,
          height: 420,
          border: "1.5px solid rgba(52,211,153,0.24)",
          borderRadius: 28,
          background: "rgba(16,185,129,0.05)",
        }}
      >
        <div style={{ position: "absolute", top: 14, left: 18, color: "#34d399", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
          Trusted Control Plane
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 960,
          top: 130,
          width: 310,
          height: 400,
          border: "1.5px dashed rgba(167,139,250,0.42)",
          borderRadius: 24,
          background: "rgba(124,58,237,0.06)",
        }}
      >
        <div style={{ position: "absolute", top: 14, left: 18, color: "#a78bfa", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
          Approved Tool Zone
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 390,
          top: 460,
          width: 310,
          height: 140,
          border: "1.5px dashed rgba(239,68,68,0.42)",
          borderRadius: 24,
          background: "rgba(239,68,68,0.05)",
        }}
      >
        <div style={{ position: "absolute", top: 14, left: 18, color: "#ef4444", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
          Secret Boundary
        </div>
      </div>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {ARROWS.map((arrow, index) => {
          const fromNode = NODES.find((node) => node.id === arrow.from)!;
          const toNode = NODES.find((node) => node.id === arrow.to)!;
          const from = center(fromNode);
          const to = center(toNode);
          const progress = interpolate(frame, [arrow.appearAt, arrow.appearAt + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          if (progress <= 0) {
            return null;
          }

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const currentLen = len * progress;
          const endX = from.x + (dx / len) * currentLen;
          const endY = from.y + (dy / len) * currentLen;

          return (
            <g key={index} opacity={progress}>
              <line
                x1={from.x}
                y1={from.y}
                x2={endX}
                y2={endY}
                stroke={arrow.color}
                strokeWidth={arrow.dashed ? 2 : 3}
                strokeDasharray={arrow.dashed ? "10 8" : "none"}
                opacity={0.8}
              />
              {progress > 0.8 && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 10}
                  fill={arrow.color}
                  fontSize={12}
                  fontWeight={700}
                  textAnchor="middle"
                >
                  {arrow.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {NODES.map((node) => {
        const appear = spring({ fps, frame: frame - node.appearAt, config: { damping: 14 } });
        const scale = interpolate(appear, [0, 1], [0.35, 1]);
        const opacity = interpolate(appear, [0, 1], [0, 1]);
        const isPolicy = node.id === "policy";
        const isSecrets = node.id === "secrets";

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
              width: node.width,
              height: node.height,
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 18,
                background: isSecrets
                  ? "linear-gradient(180deg, rgba(127,29,29,0.35), rgba(69,10,10,0.65))"
                  : `${node.color}14`,
                border: `1.5px solid ${node.color}`,
                boxShadow: isPolicy
                  ? `0 0 0 1px ${node.color}88, 0 0 ${18 + pulse * 20}px ${node.color}44`
                  : `0 18px 30px -18px rgba(0,0,0,0.65)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 12,
              }}
            >
              <div style={{ fontSize: node.id === "server" ? 30 : 26 }}>{node.icon}</div>
              <div style={{ color: node.color, fontSize: node.id === "server" ? 20 : 16, fontWeight: 800, marginTop: 4 }}>
                {node.label}
              </div>
              <div style={{ color: "#cbd5e1", fontSize: 11, marginTop: 4, lineHeight: 1.35 }}>
                {node.description}
              </div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 110,
          top: 420,
          width: 250,
          opacity: interpolate(frame, [150, 260], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>
          Permission checks
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {POLICY_PILLS.map((pill) => (
            <span
              key={pill}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(30,41,59,0.9)",
                color: "#e2e8f0",
                fontSize: 12,
                border: "1px solid rgba(148,163,184,0.2)",
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 26,
          textAlign: "center",
          color: "#94a3b8",
          fontSize: 15,
          fontWeight: 600,
          opacity: interpolate(frame, [1080, 1200], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Requests are mediated by policy. Tools are scoped. Secrets stay behind the boundary.
      </div>
    </AbsoluteFill>
  );
};