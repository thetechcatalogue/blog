import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const W = 1920;
const H = 1080;
const ACCENT = "#06b6d4";
const BG = "linear-gradient(135deg, #001a1a 0%, #042f2e 55%, #0f766e 100%)";

function spr(frame: number, from: number, fps: number) {
  return spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 80 } });
}

const AGENTS = [
  { id: "researcher", label: "Researcher",  icon: "🔍", color: "#22d3ee", cx: 960,  cy: 170,  w: 240, h: 80 },
  { id: "coder",      label: "Coder",        icon: "💻", color: "#67e8f9", cx: 1560, cy: 490,  w: 240, h: 80 },
  { id: "writer",     label: "Writer",       icon: "✍️",  color: "#22d3ee", cx: 960,  cy: 840,  w: 240, h: 80 },
  { id: "critic",     label: "Critic",       icon: "🔬", color: "#67e8f9", cx: 360,  cy: 490,  w: 240, h: 80 },
];

// Center orchestrator
const ORC = { cx: 960, cy: 490, w: 280, h: 100 };

export const MultiAgentDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();

  const orcAt = Math.round(D * 0.05);
  const loopStart = Math.round(D * 0.45);
  const cycleLen = Math.max(50, Math.round(D * 0.55));

  const orcS = spr(frame, orcAt, fps);

  // Task packets: animated circles flying from orchestrator to each agent and back
  // Each cycle: 4 tasks out (staggered), 4 results back
  const getPacketState = (agentIdx: number) => {
    if (frame < loopStart) return null;
    const agentPhase = (agentIdx / AGENTS.length) * cycleLen;
    const elapsed = (frame - loopStart + agentPhase) % cycleLen;
    const halfCycle = cycleLen / 2;

    if (elapsed < halfCycle) {
      // Task going out
      const p = elapsed / halfCycle;
      const ag = AGENTS[agentIdx];
      const x = ORC.cx + (ag.cx - ORC.cx) * p;
      const y = ORC.cy + (ag.cy - ORC.cy) * p;
      const opacity = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
      return { x, y, opacity, returning: false, color: ag.color };
    } else {
      // Result returning
      const p = (elapsed - halfCycle) / halfCycle;
      const ag = AGENTS[agentIdx];
      const x = ag.cx + (ORC.cx - ag.cx) * p;
      const y = ag.cy + (ORC.cy - ag.cy) * p;
      const opacity = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
      return { x, y, opacity, returning: true, color: ACCENT };
    }
  };

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "system-ui, sans-serif" }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* Title */}
      <div style={{
        position: "absolute", top: 30, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: "white", letterSpacing: -1 }}>
          Multi-Agent Systems
        </div>
        <div style={{ fontSize: 20, color: "#67e8f9", marginTop: 6 }}>
          Orchestrator delegates to specialized agents — results converge
        </div>
      </div>

      {/* SVG spokes (static lines) + packets */}
      <svg style={{ position: "absolute", inset: 0, width: W, height: H, overflow: "visible" }}>
        <defs>
          <marker id="ah-multi" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={ACCENT} />
          </marker>
        </defs>

        {/* Static spoke lines */}
        {AGENTS.map((ag, i) => {
          const at = orcAt + 8 + i * 10;
          if (frame < at) return null;
          const len = Math.sqrt((ag.cx - ORC.cx) ** 2 + (ag.cy - ORC.cy) ** 2);
          const progress = interpolate(frame, [at, at + 25], [0, 1], { extrapolateRight: "clamp" });
          return (
            <line key={ag.id}
              x1={ORC.cx} y1={ORC.cy}
              x2={ORC.cx + (ag.cx - ORC.cx) * progress}
              y2={ORC.cy + (ag.cy - ORC.cy) * progress}
              stroke={ag.color} strokeWidth={1.5} opacity={0.30}
            />
          );
        })}

        {/* Task/result packets */}
        {AGENTS.map((_, i) => {
          const packet = getPacketState(i);
          if (!packet || packet.opacity <= 0) return null;
          return (
            <g key={`packet-${i}`}>
              <circle cx={packet.x} cy={packet.y} r={14}
                fill={packet.returning ? ACCENT : AGENTS[i].color}
                opacity={packet.opacity * 0.3} />
              <circle cx={packet.x} cy={packet.y} r={8}
                fill={packet.returning ? ACCENT : AGENTS[i].color}
                opacity={packet.opacity} />
              <text x={packet.x} y={packet.y + 5} fill="black" fontSize={10}
                textAnchor="middle" fontWeight={700}>
                {packet.returning ? "✓" : "→"}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Orchestrator */}
      <div style={{
        position: "absolute",
        left: ORC.cx - ORC.w / 2, top: ORC.cy - ORC.h / 2,
        width: ORC.w, height: ORC.h,
        transform: `scale(${orcS})`, transformOrigin: "center",
        opacity: Math.min(1, orcS * 1.5),
        display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        background: "rgba(6,182,212,0.15)",
        border: "2px solid #06b6d4",
        borderRadius: 20,
        boxShadow: "0 0 50px #06b6d466",
      }}>
        <span style={{ fontSize: 36 }}>🎭</span>
        <div>
          <div style={{ color: "#67e8f9", fontSize: 14 }}>Central</div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 700 }}>Orchestrator</div>
        </div>
      </div>

      {/* Agent nodes */}
      {AGENTS.map((ag, i) => {
        const at = orcAt + 10 + i * 12;
        const s = spr(frame, at, fps);
        return (
          <div key={ag.id} style={{
            position: "absolute",
            left: ag.cx - ag.w / 2, top: ag.cy - ag.h / 2,
            width: ag.w, height: ag.h,
            transform: `scale(${s})`, transformOrigin: "center",
            opacity: Math.min(1, s * 1.5),
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: "rgba(255,255,255,0.07)",
            border: `2px solid ${ag.color}`,
            borderRadius: 18,
            boxShadow: `0 0 24px ${ag.color}44`,
          }}>
            <span style={{ fontSize: 28 }}>{ag.icon}</span>
            <span style={{ color: "white", fontSize: 19, fontWeight: 600 }}>{ag.label}</span>
          </div>
        );
      })}

      {/* Labels for packet types */}
      {frame >= loopStart && (
        <div style={{
          position: "absolute", right: 60, top: H / 2 - 60,
          opacity: interpolate(frame, [loopStart, loopStart + 20], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#67e8f9" }} />
            <span style={{ color: "#a5f3fc", fontSize: 18 }}>task assigned</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: ACCENT }} />
            <span style={{ color: "#a5f3fc", fontSize: 18 }}>result returned</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [Math.round(D * 0.7), Math.round(D * 0.8)], [0, 1], { extrapolateRight: "clamp" }),
        color: "#67e8f9", fontSize: 20,
      }}>
        Parallel specialization — each agent is optimized for one role
      </div>
    </AbsoluteFill>
  );
};
