import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const W = 1920;
const H = 1080;
const ACCENT = "#10b981";
const BG = "linear-gradient(135deg, #022c22 0%, #064e3b 60%, #065f46 100%)";

function spr(frame: number, from: number, fps: number) {
  return spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 80 } });
}

interface NodeDef {
  id: string;
  label: string;
  icon: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  color: string;
  appearAt: number;
}

interface ArrowDef {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  appearAt: number;
}

export const ReflexAgentDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();

  const nodes: NodeDef[] = [
    { id: "env",   label: "Environment", icon: "🌍", cx: 960, cy: 195, w: 380, h: 90, color: "#10b981", appearAt: Math.round(D * 0.04) },
    { id: "sense", label: "Sensors",     icon: "👁️", cx: 360, cy: 530, w: 260, h: 90, color: "#6ee7b7", appearAt: Math.round(D * 0.12) },
    { id: "rules", label: "Rule Engine", icon: "⚡",  cx: 960, cy: 800, w: 300, h: 90, color: "#10b981", appearAt: Math.round(D * 0.20) },
    { id: "act",   label: "Actuators",   icon: "🦾",  cx: 1560, cy: 530, w: 260, h: 90, color: "#6ee7b7", appearAt: Math.round(D * 0.28) },
  ];

  const arrows: ArrowDef[] = [
    { x1: 820,  y1: 240, x2: 430,  y2: 485, label: "stimulus", appearAt: Math.round(D * 0.38) },
    { x1: 390,  y1: 575, x2: 860,  y2: 755, label: "percept",  appearAt: Math.round(D * 0.45) },
    { x1: 1110, y1: 800, x2: 1520, y2: 575, label: "action",   appearAt: Math.round(D * 0.52) },
    { x1: 1530, y1: 485, x2: 1100, y2: 240, label: "effect",   appearAt: Math.round(D * 0.59) },
  ];

  const loopStart = Math.round(D * 0.68);
  const cycleLen = Math.max(40, Math.round(D * 0.32));

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
          Reflex Agents
        </div>
        <div style={{ fontSize: 20, color: "#6ee7b7", marginTop: 6 }}>
          Sense → Decide → Act — no memory, no planning
        </div>
      </div>

      {/* SVG arrow layer */}
      <svg style={{ position: "absolute", inset: 0, width: W, height: H, overflow: "visible" }}>
        <defs>
          <marker id="ah-reflex" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={ACCENT} />
          </marker>
        </defs>
        {arrows.map((a, i) => {
          if (frame < a.appearAt) return null;
          const len = Math.sqrt((a.x2 - a.x1) ** 2 + (a.y2 - a.y1) ** 2);
          const progress = interpolate(frame, [a.appearAt, a.appearAt + 25], [0, 1], { extrapolateRight: "clamp" });
          const offset = len * (1 - progress);
          const mx = (a.x1 + a.x2) / 2;
          const my = (a.y1 + a.y2) / 2;
          const angle = Math.atan2(a.y2 - a.y1, a.x2 - a.x1) * (180 / Math.PI);
          const labelOffset = (angle > 90 || angle < -90) ? 20 : -14;

          let dotX = a.x1, dotY = a.y1, dotOpacity = 0;
          if (frame >= loopStart && progress >= 1) {
            const phase = (i / arrows.length) * cycleLen;
            const dp = ((frame - loopStart + phase) % cycleLen) / cycleLen;
            dotX = a.x1 + (a.x2 - a.x1) * dp;
            dotY = a.y1 + (a.y2 - a.y1) * dp;
            dotOpacity = interpolate(dp, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
          }

          return (
            <g key={i}>
              <line
                x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
                stroke={ACCENT} strokeWidth={2.5} opacity={0.55}
                strokeDasharray={len} strokeDashoffset={offset}
                markerEnd="url(#ah-reflex)"
              />
              <text x={mx} y={my + labelOffset} fill="#a7f3d0" fontSize={17} textAnchor="middle"
                opacity={progress} fontWeight={500}>
                {a.label}
              </text>
              {dotOpacity > 0 && (
                <>
                  <circle cx={dotX} cy={dotY} r={10} fill={ACCENT} opacity={dotOpacity * 0.3} />
                  <circle cx={dotX} cy={dotY} r={6} fill={ACCENT} opacity={dotOpacity} />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((n) => {
        const s = spr(frame, n.appearAt, fps);
        return (
          <div key={n.id} style={{
            position: "absolute",
            left: n.cx - n.w / 2, top: n.cy - n.h / 2,
            width: n.w, height: n.h,
            transform: `scale(${s})`,
            transformOrigin: "center",
            opacity: Math.min(1, s * 1.5),
            display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
            background: "rgba(255,255,255,0.07)",
            border: `2px solid ${n.color}`,
            borderRadius: 20,
            boxShadow: `0 0 32px ${n.color}55`,
          }}>
            <span style={{ fontSize: 34 }}>{n.icon}</span>
            <span style={{ color: "white", fontSize: 22, fontWeight: 600 }}>{n.label}</span>
          </div>
        );
      })}

      {/* Footer note */}
      <div style={{
        position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [Math.round(D * 0.65), Math.round(D * 0.75)], [0, 1], { extrapolateRight: "clamp" }),
        color: "#6ee7b7", fontSize: 20,
      }}>
        No internal state — same input always produces the same output
      </div>
    </AbsoluteFill>
  );
};
