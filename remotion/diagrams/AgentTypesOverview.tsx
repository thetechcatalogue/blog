import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const W = 1920;
const H = 1080;
const BG = "linear-gradient(135deg, #0a0a1a 0%, #0f0a2e 50%, #1a0a2e 100%)";

function spr(frame: number, from: number, fps: number) {
  return spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 80 } });
}

const AGENTS = [
  {
    id: "reflex",
    label: "Reflex Agents",
    icon: "⚡",
    tagline: "Condition → Action",
    desc: "Fixed rules, no memory",
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
  },
  {
    id: "tooluse",
    label: "Tool-Use Agents",
    icon: "🔧",
    tagline: "Reason → Act → Observe",
    desc: "ReAct loop with external tools",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.10)",
  },
  {
    id: "planning",
    label: "Planning Agents",
    icon: "📋",
    tagline: "Goal → Plan → Execute",
    desc: "Decompose before acting",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
  },
  {
    id: "memory",
    label: "Memory Agents",
    icon: "🧠",
    tagline: "Retrieve → Reason → Store",
    desc: "Short & long-term context",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.10)",
  },
  {
    id: "multi",
    label: "Multi-Agent",
    icon: "🎭",
    tagline: "Orchestrate → Delegate",
    desc: "Specialized agents in parallel",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.10)",
  },
  {
    id: "auto",
    label: "Autonomous Agents",
    icon: "🔄",
    tagline: "Observe → Reason → Act",
    desc: "Self-directed, no human loop",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.10)",
  },
];

// 3×2 grid: 3 columns, 2 rows
const CARD_W = 470;
const CARD_H = 190;
const COL_CX = [350, 960, 1570];
const ROW_CY = [360, 640];

function cardPos(i: number) {
  return { cx: COL_CX[i % 3], cy: ROW_CY[Math.floor(i / 3)] };
}

export const AgentTypesOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();

  // Cards stagger in
  const cardStagger = Math.round(D * 0.07);
  const cardAppearFrames = AGENTS.map((_, i) => Math.round(D * 0.08) + i * cardStagger);

  // Complexity bar draws in after all cards
  const barStart = cardAppearFrames[5] + 20;
  const barProgress = interpolate(frame, [barStart, barStart + 40], [0, 1], { extrapolateRight: "clamp" });

  // Arrow labels fade in after bar
  const labelFade = interpolate(frame, [barStart + 45, barStart + 65], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "system-ui, sans-serif" }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* Title */}
      <div style={{
        position: "absolute", top: 30, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: "white", letterSpacing: -1 }}>
          Types of AI Agents
        </div>
        <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 6 }}>
          Six architectures — from simple rules to fully autonomous systems
        </div>
      </div>

      {/* Agent cards */}
      {AGENTS.map((agent, i) => {
        const { cx, cy } = cardPos(i);
        const at = cardAppearFrames[i];
        const s = spr(frame, at, fps);
        const opacity = Math.min(1, s * 1.5);

        return (
          <div key={agent.id} style={{
            position: "absolute",
            left: cx - CARD_W / 2,
            top: cy - CARD_H / 2,
            width: CARD_W,
            height: CARD_H,
            transform: `scale(${s})`,
            transformOrigin: "center",
            opacity,
            background: agent.bg,
            border: `2px solid ${agent.color}66`,
            borderRadius: 20,
            boxShadow: `0 0 28px ${agent.color}22`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 28px",
          }}>
            {/* Icon circle */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: `${agent.color}22`,
              border: `2px solid ${agent.color}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34,
            }}>
              {agent.icon}
            </div>

            {/* Text */}
            <div>
              <div style={{ color: "white", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                {agent.label}
              </div>
              <div style={{ color: agent.color, fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                {agent.tagline}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>
                {agent.desc}
              </div>
            </div>

            {/* Number badge */}
            <div style={{
              position: "absolute", top: 10, right: 16,
              color: `${agent.color}88`, fontSize: 13, fontWeight: 700,
            }}>
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
        );
      })}

      {/* Complexity bar */}
      <svg style={{ position: "absolute", inset: 0, width: W, height: H, overflow: "visible" }}>
        <defs>
          <linearGradient id="complexityGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <marker id="ah-overview" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
          </marker>
        </defs>

        {/* Horizontal complexity line */}
        {barProgress > 0 && (
          <line
            x1={120} y1={940}
            x2={120 + (1680 * barProgress)} y2={940}
            stroke="url(#complexityGrad)" strokeWidth={3} opacity={0.7}
            markerEnd={barProgress > 0.95 ? "url(#ah-overview)" : undefined}
          />
        )}

        {/* Tick marks under each column */}
        {COL_CX.map((cx, i) => (
          barProgress > (i * 0.33) && (
            <line key={i} x1={cx} y1={934} x2={cx} y2={948}
              stroke="#475569" strokeWidth={1.5} opacity={labelFade} />
          )
        ))}
        {[1430, 1570].map((cx, i) => (
          barProgress > 0.8 && (
            <line key={`r${i}`} x1={cx} y1={934} x2={cx} y2={948}
              stroke="#475569" strokeWidth={1.5} opacity={labelFade} />
          )
        ))}
      </svg>

      {/* Complexity labels */}
      {labelFade > 0 && (
        <>
          <div style={{
            position: "absolute", left: 100, top: 956,
            color: "#10b981", fontSize: 14, fontWeight: 600, opacity: labelFade,
          }}>
            Simple
          </div>
          <div style={{
            position: "absolute", right: 100, top: 956,
            color: "#a855f7", fontSize: 14, fontWeight: 600, opacity: labelFade,
          }}>
            Autonomous
          </div>
          <div style={{
            position: "absolute", left: 0, right: 0, top: 956,
            textAlign: "center", color: "#475569", fontSize: 14, opacity: labelFade,
          }}>
            ← increasing capability & complexity →
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
