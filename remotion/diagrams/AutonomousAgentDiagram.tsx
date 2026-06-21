import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const W = 1920;
const H = 1080;
const ACCENT = "#a855f7";
const BG = "linear-gradient(135deg, #0a0010 0%, #1e0035 55%, #3b0764 100%)";

function spr(frame: number, from: number, fps: number) {
  return spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 80 } });
}

const CX = 960;
const CY = 490;
const RADIUS = 290;

// 4 stage nodes at 0°(right), 90°(top), 180°(left), 270°(bottom)
const STAGES = [
  { id: "observe",  label: "Observe",  icon: "👁️",  angle: 0,   color: "#c084fc", desc: "Gather environment signals" },
  { id: "reason",   label: "Reason",   icon: "🧠",  angle: 90,  color: "#a855f7", desc: "Interpret & plan"          },
  { id: "decide",   label: "Decide",   icon: "🎯",  angle: 180, color: "#9333ea", desc: "Choose next action"        },
  { id: "act",      label: "Act",      icon: "⚡",  angle: 270, color: "#c084fc", desc: "Execute action"            },
];

function stagePosRaw(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CX + Math.cos(rad) * RADIUS,
    y: CY - Math.sin(rad) * RADIUS,
  };
}

export const AutonomousAgentDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();

  const stagesAt = STAGES.map((_, i) => Math.round(D * (0.05 + i * 0.09)));
  const arrowsAt = Math.round(D * 0.44);
  const loopStart = Math.round(D * 0.54);
  const cycleLen = Math.max(60, Math.round(D * 0.46));

  // Active stage in animation loop
  const activeStage = frame >= loopStart
    ? Math.floor(((frame - loopStart) / cycleLen) * STAGES.length) % STAGES.length
    : -1;

  // Iteration counter
  const iteration = frame >= loopStart
    ? Math.floor((frame - loopStart) / cycleLen) + 1
    : 0;

  // Arc progress indicator
  const arcProgress = frame >= loopStart
    ? (((frame - loopStart) % cycleLen) / cycleLen)
    : 0;

  const arcRadius = 180;
  const circumference = 2 * Math.PI * arcRadius;
  const arcOffset = circumference * (1 - arcProgress);

  // Self-reflect pulse in center
  const reflectPulse = frame >= loopStart
    ? Math.sin(((frame - loopStart) / cycleLen) * Math.PI * 2) * 0.5 + 0.5
    : 0;

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
          Autonomous Agents
        </div>
        <div style={{ fontSize: 20, color: "#d8b4fe", marginTop: 6 }}>
          Continuous self-directed loop — observe, reason, decide, act, repeat
        </div>
      </div>

      {/* SVG: ring arcs + arrows */}
      <svg style={{ position: "absolute", inset: 0, width: W, height: H, overflow: "visible" }}>
        <defs>
          <marker id="ah-auto" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={ACCENT} />
          </marker>
          {/* Subtle ring */}
          <filter id="glow-auto">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        {frame >= stagesAt[0] && (
          <circle cx={CX} cy={CY} r={RADIUS}
            fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth={2} />
        )}

        {/* Progress arc */}
        {frame >= loopStart && (
          <circle cx={CX} cy={CY} r={arcRadius}
            fill="none" stroke={ACCENT} strokeWidth={3} opacity={0.5}
            strokeDasharray={circumference} strokeDashoffset={arcOffset}
            transform={`rotate(-90 ${CX} ${CY})`}
            filter="url(#glow-auto)"
          />
        )}

        {/* Arrows between stages */}
        {STAGES.map((stage, i) => {
          if (frame < arrowsAt + i * 8) return null;
          const next = STAGES[(i + 1) % STAGES.length];
          const p1 = stagePosRaw(stage.angle);
          const p2 = stagePosRaw(next.angle);
          // Midpoint slightly inward
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          const len = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
          const progress = interpolate(frame, [arrowsAt + i * 8, arrowsAt + i * 8 + 25], [0, 1], { extrapolateRight: "clamp" });
          const isActive = activeStage === i;

          return (
            <g key={stage.id}>
              <line
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={isActive ? stage.color : "#7c3aed"}
                strokeWidth={isActive ? 3 : 1.5}
                opacity={isActive ? 0.9 : 0.35}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - progress)}
                markerEnd="url(#ah-auto)"
              />
              {/* Arrow label */}
              <text x={mx} y={my} fill="#c084fc" fontSize={15} textAnchor="middle" opacity={progress * 0.7}>
                {["signal", "thought", "choice", "feedback"][i]}
              </text>
            </g>
          );
        })}

        {/* Traveling signal dot */}
        {frame >= loopStart && (() => {
          const p = arcProgress;
          const totalAngle = p * 360;
          const rad = (-90 + totalAngle) * (Math.PI / 180);
          const dx = CX + Math.cos(rad) * RADIUS;
          const dy = CY + Math.sin(rad) * RADIUS;
          return (
            <g>
              <circle cx={dx} cy={dy} r={14} fill={ACCENT} opacity={0.25} />
              <circle cx={dx} cy={dy} r={8} fill={ACCENT} opacity={0.9} />
            </g>
          );
        })()}
      </svg>

      {/* Stage node boxes */}
      {STAGES.map((stage, i) => {
        const pos = stagePosRaw(stage.angle);
        const nodeW = 220, nodeH = 80;
        const s = spr(frame, stagesAt[i], fps);
        const isActive = activeStage === i;

        return (
          <div key={stage.id} style={{
            position: "absolute",
            left: pos.x - nodeW / 2, top: pos.y - nodeH / 2,
            width: nodeW, height: nodeH,
            transform: `scale(${s})`, transformOrigin: "center",
            opacity: Math.min(1, s * 1.5),
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: isActive ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.07)",
            border: `2px solid ${isActive ? stage.color : stage.color + "88"}`,
            borderRadius: 18,
            boxShadow: isActive ? `0 0 40px ${stage.color}88` : `0 0 16px ${stage.color}22`,
          }}>
            <span style={{ fontSize: 30 }}>{stage.icon}</span>
            <div>
              <div style={{ color: "white", fontSize: 19, fontWeight: 700 }}>{stage.label}</div>
              <div style={{ color: "#d8b4fe", fontSize: 13 }}>{stage.desc}</div>
            </div>
          </div>
        );
      })}

      {/* Center: iteration counter + reflect */}
      <div style={{
        position: "absolute",
        left: CX - 100, top: CY - 70,
        width: 200, height: 140,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: interpolate(frame, [stagesAt[0], stagesAt[0] + 30], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 34, marginBottom: 6 }}>🔄</div>
        <div style={{ color: "#d8b4fe", fontSize: 16 }}>iteration</div>
        <div style={{ color: "white", fontSize: 44, fontWeight: 800, lineHeight: 1 }}>
          {iteration > 0 ? iteration : "—"}
        </div>
        {frame >= loopStart && (
          <div style={{
            marginTop: 8, color: "#c084fc", fontSize: 14, fontWeight: 500,
            opacity: reflectPulse,
          }}>
            ⚡ self-reflecting
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [Math.round(D * 0.72), Math.round(D * 0.82)], [0, 1], { extrapolateRight: "clamp" }),
        color: "#d8b4fe", fontSize: 20,
      }}>
        No human in the loop — goal persistence drives the cycle until termination
      </div>
    </AbsoluteFill>
  );
};
