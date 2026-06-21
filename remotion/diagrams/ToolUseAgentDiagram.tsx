import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const W = 1920;
const H = 1080;
const ACCENT = "#818cf8";
const BG = "linear-gradient(135deg, #0f0a2e 0%, #1e1b4b 55%, #312e81 100%)";

function spr(frame: number, from: number, fps: number) {
  return spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 80 } });
}

// Triangle layout: LLM top, Tools bottom-left, Observe bottom-right
const LLM  = { cx: 960, cy: 220, w: 340, h: 100 };
const TOOL = { cx: 430, cy: 800, w: 300, h: 100 };
const OBS  = { cx: 1490, cy: 800, w: 300, h: 100 };

const TOOL_CHIPS = ["web_search(query)", "run_code(script)", "read_file(path)", "browser.get(url)"];

export const ToolUseAgentDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();

  const nodes = [
    { id: "llm",  label: "LLM / Reason",  icon: "🧠", ...LLM,  color: "#818cf8", appearAt: Math.round(D * 0.04) },
    { id: "tool", label: "Tool Call / Act", icon: "🔧", ...TOOL, color: "#a78bfa", appearAt: Math.round(D * 0.13) },
    { id: "obs",  label: "Observe Result", icon: "🔭", ...OBS,  color: "#818cf8", appearAt: Math.round(D * 0.22) },
  ];

  // Arrow: LLM→Tool, Tool→Obs, Obs→LLM
  const arrows = [
    { x1: 780,  y1: 295, x2: 540,  y2: 750, label: "tool call",    color: "#a78bfa", appearAt: Math.round(D * 0.33) },
    { x1: 580,  y1: 800, x2: 1340, y2: 800, label: "result",       color: "#818cf8", appearAt: Math.round(D * 0.42) },
    { x1: 1440, y1: 750, x2: 1100, y2: 295, label: "new context",  color: "#a78bfa", appearAt: Math.round(D * 0.51) },
  ];

  const loopStart = Math.round(D * 0.60);
  const cycleLen = Math.max(40, Math.round(D * 0.40));

  // Iteration counter
  const iterCount = frame < loopStart ? 0 : Math.floor((frame - loopStart) / (cycleLen / 3)) + 1;

  // Chip stagger
  const chipBase = Math.round(D * 0.35);

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
          Tool-Use Agents
        </div>
        <div style={{ fontSize: 20, color: "#c4b5fd", marginTop: 6 }}>
          The ReAct Loop — Reason → Act → Observe → repeat
        </div>
      </div>

      {/* SVG arrows */}
      <svg style={{ position: "absolute", inset: 0, width: W, height: H, overflow: "visible" }}>
        <defs>
          <marker id="ah-tool" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={ACCENT} />
          </marker>
        </defs>
        {arrows.map((a, i) => {
          if (frame < a.appearAt) return null;
          const len = Math.sqrt((a.x2 - a.x1) ** 2 + (a.y2 - a.y1) ** 2);
          const progress = interpolate(frame, [a.appearAt, a.appearAt + 28], [0, 1], { extrapolateRight: "clamp" });
          const offset = len * (1 - progress);
          const mx = (a.x1 + a.x2) / 2;
          const my = (a.y1 + a.y2) / 2;
          const labelDx = i === 1 ? 0 : (i === 0 ? -60 : 60);
          const labelDy = i === 1 ? -14 : 0;

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
                stroke={a.color} strokeWidth={2.5} opacity={0.55}
                strokeDasharray={len} strokeDashoffset={offset}
                markerEnd="url(#ah-tool)"
              />
              <text x={mx + labelDx} y={my + labelDy} fill="#c4b5fd" fontSize={18}
                textAnchor="middle" opacity={progress} fontWeight={500}>
                {a.label}
              </text>
              {dotOpacity > 0 && (
                <>
                  <circle cx={dotX} cy={dotY} r={10} fill={a.color} opacity={dotOpacity * 0.3} />
                  <circle cx={dotX} cy={dotY} r={6} fill={a.color} opacity={dotOpacity} />
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
            transform: `scale(${s})`, transformOrigin: "center",
            opacity: Math.min(1, s * 1.5),
            display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
            background: "rgba(255,255,255,0.07)",
            border: `2px solid ${n.color}`,
            borderRadius: 20,
            boxShadow: `0 0 32px ${n.color}55`,
          }}>
            <span style={{ fontSize: 36 }}>{n.icon}</span>
            <span style={{ color: "white", fontSize: 21, fontWeight: 600 }}>{n.label}</span>
          </div>
        );
      })}

      {/* Tool chips below the Tool node */}
      {TOOL_CHIPS.map((chip, i) => {
        const at = chipBase + i * 12;
        const s = spr(frame, at, fps);
        return (
          <div key={chip} style={{
            position: "absolute",
            left: TOOL.cx - 140,
            top: TOOL.cy + 60 + i * 38,
            transform: `scale(${s})`, transformOrigin: "left",
            opacity: Math.min(1, s * 1.5),
            background: "rgba(167,139,250,0.15)",
            border: "1px solid #a78bfa66",
            borderRadius: 8, padding: "4px 14px",
            color: "#c4b5fd", fontSize: 16, fontFamily: "monospace",
          }}>
            {chip}
          </div>
        );
      })}

      {/* Iteration counter in triangle center */}
      {iterCount > 0 && (
        <div style={{
          position: "absolute", left: 960 - 60, top: 520,
          width: 120, height: 60,
          display: "flex", flexDirection: "column", alignItems: "center",
          opacity: interpolate(frame, [loopStart, loopStart + 20], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          <div style={{ color: "#a78bfa", fontSize: 16 }}>iteration</div>
          <div style={{ color: "white", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{iterCount}</div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [Math.round(D * 0.65), Math.round(D * 0.75)], [0, 1], { extrapolateRight: "clamp" }),
        color: "#c4b5fd", fontSize: 20,
      }}>
        Each iteration: the model reasons, calls a tool, reads the result, and decides the next step
      </div>
    </AbsoluteFill>
  );
};
