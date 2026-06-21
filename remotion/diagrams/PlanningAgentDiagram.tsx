import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const W = 1920;
const H = 1080;
const ACCENT = "#f59e0b";
const BG = "linear-gradient(135deg, #1c0a00 0%, #431407 55%, #7c2d12 100%)";

function spr(frame: number, from: number, fps: number) {
  return spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 80 } });
}

const STEPS = [
  { label: "Gather Sources",  icon: "🔍", color: "#fbbf24" },
  { label: "Outline Draft",   icon: "📝", color: "#f59e0b" },
  { label: "Write Sections",  icon: "✍️",  color: "#d97706" },
  { label: "Review & Edit",   icon: "✅",  color: "#fbbf24" },
];

export const PlanningAgentDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();

  const goalAt   = Math.round(D * 0.05);
  const planAt   = Math.round(D * 0.18);
  const stepsAt  = Math.round(D * 0.30);
  const execAt   = Math.round(D * 0.52);

  const goalS = spr(frame, goalAt, fps);
  const planS = spr(frame, planAt, fps);

  // Goal box
  const goalX = 960, goalY = 185, goalW = 400, goalH = 96;
  // Plan node
  const planX = 960, planY = 360, planW = 280, planH = 80;
  // Step boxes row
  const stepY = 580;
  const stepW = 300, stepH = 90;
  const stepXs = [310, 720, 1130, 1540];

  // Execution: highlight steps one by one
  const execCycleLen = Math.max(30, Math.round(D * 0.50));
  let activeStep = -1;
  if (frame >= execAt) {
    const elapsed = frame - execAt;
    activeStep = Math.floor((elapsed / execCycleLen) * STEPS.length) % STEPS.length;
  }

  // SVG lines: goal→plan, plan→each step
  const goalToplanLen = Math.sqrt((planX - goalX) ** 2 + (planY - goalY - 40) ** 2);
  const lineProgress = (at: number) =>
    interpolate(frame, [at, at + 25], [0, 1], { extrapolateRight: "clamp" });

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
          Planning Agents
        </div>
        <div style={{ fontSize: 20, color: "#fcd34d", marginTop: 6 }}>
          Decompose a goal into steps — then execute
        </div>
      </div>

      {/* SVG lines */}
      <svg style={{ position: "absolute", inset: 0, width: W, height: H, overflow: "visible" }}>
        <defs>
          <marker id="ah-plan" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={ACCENT} />
          </marker>
        </defs>
        {/* Goal → Planner */}
        {frame >= goalAt && (
          <line
            x1={goalX} y1={goalY + 48} x2={planX} y2={planY - 40}
            stroke={ACCENT} strokeWidth={2.5} opacity={0.5}
            strokeDasharray={goalToplanLen}
            strokeDashoffset={goalToplanLen * (1 - lineProgress(goalAt + 15))}
            markerEnd="url(#ah-plan)"
          />
        )}
        {/* Planner → each step */}
        {STEPS.map((_, i) => {
          const at = stepsAt + i * 8;
          if (frame < at) return null;
          const sx = stepXs[i] + stepW / 2;
          const len = Math.sqrt((sx - planX) ** 2 + (stepY - planY - 40) ** 2);
          return (
            <line key={i}
              x1={planX} y1={planY + 40} x2={sx} y2={stepY - 45}
              stroke={STEPS[i].color} strokeWidth={2} opacity={0.45}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - lineProgress(at))}
              markerEnd="url(#ah-plan)"
            />
          );
        })}
      </svg>

      {/* Goal box */}
      <div style={{
        position: "absolute",
        left: goalX - goalW / 2, top: goalY - goalH / 2,
        width: goalW, height: goalH,
        transform: `scale(${goalS})`, transformOrigin: "center",
        opacity: Math.min(1, goalS * 1.5),
        display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        background: "rgba(245,158,11,0.15)",
        border: "2px solid #f59e0b",
        borderRadius: 20,
        boxShadow: "0 0 40px #f59e0b44",
      }}>
        <span style={{ fontSize: 38 }}>🎯</span>
        <div>
          <div style={{ color: "#fcd34d", fontSize: 16, fontWeight: 500 }}>GOAL</div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 700 }}>Write a technical blog post</div>
        </div>
      </div>

      {/* Planner node */}
      <div style={{
        position: "absolute",
        left: planX - planW / 2, top: planY - planH / 2,
        width: planW, height: planH,
        transform: `scale(${planS})`, transformOrigin: "center",
        opacity: Math.min(1, planS * 1.5),
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        background: "rgba(255,255,255,0.07)",
        border: "2px solid #f59e0b",
        borderRadius: 16,
        boxShadow: "0 0 24px #f59e0b44",
      }}>
        <span style={{ fontSize: 30 }}>📋</span>
        <span style={{ color: "white", fontSize: 20, fontWeight: 600 }}>Planner</span>
      </div>

      {/* Step boxes */}
      {STEPS.map((step, i) => {
        const at = stepsAt + i * 10;
        const s = spr(frame, at, fps);
        const isActive = activeStep === i;
        const glow = isActive
          ? interpolate(
              (frame - execAt) % 20,
              [0, 10, 20],
              [0.5, 1, 0.5],
              { extrapolateRight: "clamp" }
            )
          : 0;
        return (
          <div key={i} style={{
            position: "absolute",
            left: stepXs[i], top: stepY - stepH / 2,
            width: stepW, height: stepH,
            transform: `scale(${s})`, transformOrigin: "center",
            opacity: Math.min(1, s * 1.5),
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: isActive ? `rgba(245,158,11,0.20)` : "rgba(255,255,255,0.06)",
            border: `2px solid ${isActive ? step.color : step.color + "88"}`,
            borderRadius: 18,
            boxShadow: isActive ? `0 0 40px ${step.color}88` : `0 0 16px ${step.color}22`,
            transition: "none",
          }}>
            <span style={{ fontSize: 28 }}>{step.icon}</span>
            <span style={{ color: "white", fontSize: 18, fontWeight: 600 }}>{step.label}</span>
            {isActive && (
              <div style={{
                position: "absolute", top: -12, right: 12,
                background: "#f59e0b", borderRadius: 8, padding: "2px 10px",
                color: "black", fontSize: 13, fontWeight: 700,
                opacity: glow,
              }}>
                executing
              </div>
            )}
          </div>
        );
      })}

      {/* Step order labels */}
      {STEPS.map((_, i) => {
        const at = stepsAt + i * 10 + 15;
        if (frame < at) return null;
        return (
          <div key={`num-${i}`} style={{
            position: "absolute",
            left: stepXs[i] + stepW / 2 - 18,
            top: stepY + stepH / 2 + 8,
            width: 36, height: 36,
            borderRadius: "50%",
            background: "rgba(245,158,11,0.15)",
            border: "1px solid #f59e0b66",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fcd34d", fontSize: 16, fontWeight: 700,
            opacity: interpolate(frame, [at, at + 15], [0, 1], { extrapolateRight: "clamp" }),
          }}>
            {i + 1}
          </div>
        );
      })}

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [execAt, execAt + 20], [0, 1], { extrapolateRight: "clamp" }),
        color: "#fcd34d", fontSize: 20,
      }}>
        The planner decomposes first — the executor runs each step in order
      </div>
    </AbsoluteFill>
  );
};
