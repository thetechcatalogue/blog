import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// ═══════════════════════════════════════════════════════════
// CodeMarker Product Pitch — Cinematic Animated Video
// Total: ~150s = 4500 frames @ 30fps
// ═══════════════════════════════════════════════════════════

// ── Scene definitions ──
interface PitchScene {
  id: string;
  startFrame: number;
  endFrame: number;
}

const SCENES: PitchScene[] = [
  { id: "hook", startFrame: 0, endFrame: 378 },          // 0–13s: Opening hook
  { id: "problem", startFrame: 378, endFrame: 883 },     // 13–29s: The problem
  { id: "solution", startFrame: 883, endFrame: 1472 },   // 29–49s: The solution
  { id: "anchors", startFrame: 1472, endFrame: 2103 },   // 49–70s: Anchor points
  { id: "graph", startFrame: 2103, endFrame: 2944 },     // 70–98s: Knowledge graph
  { id: "copilot", startFrame: 2944, endFrame: 3574 },   // 98–119s: Copilot integration
  { id: "incident", startFrame: 3574, endFrame: 4416 },  // 119–147s: Incident response
  { id: "metrics", startFrame: 4416, endFrame: 5047 },   // 147–168s: Metrics & impact
  { id: "closing", startFrame: 5047, endFrame: 6308 },   // 168–210s: Closing + CTA
];

function getScene(frame: number): string {
  for (const s of SCENES) {
    if (frame >= s.startFrame && frame < s.endFrame) return s.id;
  }
  return "closing";
}

function sceneProgress(frame: number, scene: PitchScene): number {
  return Math.min(1, Math.max(0, (frame - scene.startFrame) / (scene.endFrame - scene.startFrame)));
}

// ── Color palette ──
const C = {
  bg: "#050510",
  accent: "#6366f1",
  accent2: "#818cf8",
  green: "#10b981",
  red: "#ef4444",
  orange: "#f59e0b",
  pink: "#ec4899",
  cyan: "#06b6d4",
  purple: "#a855f7",
  text: "#f1f5f9",
  muted: "#64748b",
  dim: "#1e293b",
};

// ── Animated background particles ──
const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 137.5 + frame * (0.15 + i * 0.01)) % 1920,
    y: (i * 89.3 + frame * (0.1 + i * 0.005)) % 1080,
    r: 1.5 + (i % 3),
    opacity: 0.15 + (Math.sin(frame * 0.02 + i) * 0.1),
  }));
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={C.accent} opacity={p.opacity} />
      ))}
    </svg>
  );
};

// ── Scene: HOOK ──
const HookScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const logoScale = spring({ fps, frame, config: { damping: 8, stiffness: 80 } });
  const taglineOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glowing ring
  const ringPulse = Math.sin(frame * 0.06) * 0.3 + 0.7;

  return (
    <>
      {/* Centered logo + tagline */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* Glow ring */}
        <div style={{
          width: 200, height: 200, borderRadius: "50%",
          border: `3px solid ${C.accent}`,
          boxShadow: `0 0 ${40 * ringPulse}px ${C.accent}66, inset 0 0 ${20 * ringPulse}px ${C.accent}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${logoScale})`,
          marginBottom: 40,
        }}>
          <span style={{ fontSize: 80 }}>⚓</span>
        </div>

        <h1 style={{
          fontSize: 72, fontWeight: 900, color: C.text, margin: 0,
          letterSpacing: -2, opacity: taglineOpacity,
          textShadow: `0 0 40px ${C.accent}88`,
        }}>
          CodeMarker
        </h1>

        <p style={{
          fontSize: 28, color: C.accent2, margin: "16px 0 0 0",
          opacity: subtitleOpacity, fontWeight: 500, letterSpacing: 4,
          textTransform: "uppercase",
        }}>
          Code Intelligence for AI Agents
        </p>
      </div>
    </>
  );
};

// ── Scene: PROBLEM ──
const ProblemScene: React.FC<{ frame: number; fps: number; scene: PitchScene }> = ({ frame, fps, scene }) => {
  const p = sceneProgress(frame, scene);

  // "AI starts blind" text
  const titleOpacity = interpolate(frame, [scene.startFrame, scene.startFrame + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Grep cycle animation — 5 steps
  const grepSteps = [
    { icon: "🔍", label: "grep 'payment'", tokens: "~8K", delay: 60 },
    { icon: "📖", label: "read payment.ts", tokens: "+12K", delay: 120 },
    { icon: "🔍", label: "grep 'retry'", tokens: "+6K", delay: 180 },
    { icon: "📖", label: "read retry.ts", tokens: "+9K", delay: 240 },
    { icon: "🔍", label: "grep 'timeout'", tokens: "+7K", delay: 300 },
  ];

  // Token counter
  const tokenValues = [0, 8000, 20000, 26000, 35000, 42000];
  const activeStep = grepSteps.reduce((acc, s, i) => (frame >= scene.startFrame + s.delay ? i + 1 : acc), 0);
  const currentTokens = tokenValues[Math.min(activeStep, tokenValues.length - 1)];

  return (
    <>
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: titleOpacity,
      }}>
        <h2 style={{ fontSize: 52, fontWeight: 800, color: C.red, margin: 0 }}>
          AI Starts Every Session <span style={{ color: C.text }}>Blind</span>
        </h2>
        <p style={{ fontSize: 22, color: C.muted, marginTop: 10 }}>
          No memory of code structure. No relationship awareness.
        </p>
      </div>

      {/* Grep-read cycle */}
      <div style={{
        position: "absolute", left: 120, top: 220, display: "flex",
        flexDirection: "column", gap: 16,
      }}>
        {grepSteps.map((step, i) => {
          const stepOpacity = spring({
            fps, frame: frame - scene.startFrame - step.delay,
            config: { damping: 12 },
          });
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              opacity: stepOpacity,
              transform: `translateX(${(1 - stepOpacity) * 60}px)`,
            }}>
              <span style={{ fontSize: 28 }}>{step.icon}</span>
              <div style={{
                background: "#0f172a", border: `1px solid ${C.dim}`,
                borderRadius: 10, padding: "12px 24px", fontFamily: "monospace",
                fontSize: 20, color: C.text, minWidth: 280,
              }}>
                {step.label}
              </div>
              <span style={{ fontSize: 16, color: C.red, fontWeight: 700 }}>
                {step.tokens}
              </span>
            </div>
          );
        })}
      </div>

      {/* Token counter — right side */}
      <div style={{
        position: "absolute", right: 120, top: 280,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 18, color: C.muted, textTransform: "uppercase",
          letterSpacing: 3, marginBottom: 12,
        }}>
          Tokens Burned
        </div>
        <div style={{
          fontSize: 80, fontWeight: 900, color: C.red,
          fontFamily: "monospace",
          textShadow: `0 0 30px ${C.red}66`,
        }}>
          {currentTokens.toLocaleString()}
        </div>
        <div style={{
          fontSize: 18, color: C.muted, marginTop: 8,
        }}>
          {activeStep} of 5-7 tool calls
        </div>

        {/* Frustrated face */}
        {activeStep >= 4 && (
          <div style={{
            fontSize: 64, marginTop: 30,
            opacity: interpolate(frame, [scene.startFrame + 260, scene.startFrame + 280], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
          }}>
            😤
          </div>
        )}
      </div>

      {/* Bottom bar — wasted */}
      <div style={{
        position: "absolute", bottom: 80, left: 120, right: 120,
        display: "flex", alignItems: "center", gap: 20,
      }}>
        <div style={{
          flex: 1, height: 8, background: C.dim, borderRadius: 4,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${Math.min(p * 120, 100)}%`, height: "100%",
            background: `linear-gradient(90deg, ${C.red}, ${C.orange})`,
            borderRadius: 4,
          }} />
        </div>
        <span style={{ fontSize: 14, color: C.red, fontWeight: 600 }}>
          Every. Single. Session.
        </span>
      </div>
    </>
  );
};

// ── Scene: SOLUTION ──
const SolutionScene: React.FC<{ frame: number; fps: number; scene: PitchScene }> = ({ frame, fps, scene }) => {
  const titleScale = spring({ fps, frame: frame - scene.startFrame, config: { damping: 10 } });

  const beforeOpacity = interpolate(frame, [scene.startFrame + 40, scene.startFrame + 60], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const arrowOpacity = interpolate(frame, [scene.startFrame + 120, scene.startFrame + 150], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const afterOpacity = interpolate(frame, [scene.startFrame + 160, scene.startFrame + 200], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <>
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        transform: `scale(${titleScale})`,
      }}>
        <h2 style={{ fontSize: 48, fontWeight: 800, color: C.text, margin: 0 }}>
          One Idea: <span style={{ color: C.accent }}>Pre-compute Once, Query Forever</span>
        </h2>
      </div>

      {/* Before / After comparison */}
      <div style={{
        position: "absolute", top: 200, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 60,
      }}>
        {/* Before */}
        <div style={{
          width: 520, opacity: beforeOpacity,
          background: `${C.red}08`, border: `2px solid ${C.red}40`,
          borderRadius: 20, padding: "36px 40px",
        }}>
          <h3 style={{ fontSize: 26, color: C.red, margin: "0 0 20px 0", fontWeight: 700 }}>
            ❌ Without CodeMarker
          </h3>
          {[
            "5–7 tool calls per question",
            "~42,000 tokens per deep query",
            "No memory across sessions",
            "Misses indirect dependencies",
            "30+ min to diagnose incidents",
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 12, opacity: beforeOpacity,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: C.red, flexShrink: 0 }} />
              <span style={{ fontSize: 18, color: C.muted }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{ opacity: arrowOpacity, fontSize: 60, color: C.accent }}>→</div>

        {/* After */}
        <div style={{
          width: 520, opacity: afterOpacity,
          background: `${C.green}08`, border: `2px solid ${C.green}40`,
          borderRadius: 20, padding: "36px 40px",
        }}>
          <h3 style={{ fontSize: 26, color: C.green, margin: "0 0 20px 0", fontWeight: 700 }}>
            ✅ With CodeMarker
          </h3>
          {[
            "1 tool call per question",
            "~500 tokens per query",
            "Persistent structural memory",
            "Full blast-radius analysis",
            "3 min from alert to root cause",
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: C.green, flexShrink: 0 }} />
              <span style={{ fontSize: 18, color: C.text }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stat */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center",
        opacity: afterOpacity,
      }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: C.accent }}>99.8% context reduction</span>
        <span style={{ fontSize: 22, color: C.muted, marginLeft: 16 }}>420K tokens → 800 tokens</span>
      </div>
    </>
  );
};

// ── Scene: ANCHORS ──
const AnchorsScene: React.FC<{ frame: number; fps: number; scene: PitchScene }> = ({ frame, fps, scene }) => {
  const titleOpacity = interpolate(frame, [scene.startFrame, scene.startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const anchorTypes = [
    { icon: "🚪", type: "Entry Point", example: "API handlers, CLI commands", color: C.accent },
    { icon: "🔐", type: "Security Boundary", example: "Auth, input validation", color: C.red },
    { icon: "⚡", type: "Core Logic", example: "Business rules, payment retry", color: C.orange },
    { icon: "🔌", type: "Integration", example: "External APIs, databases", color: C.green },
    { icon: "🏎️", type: "Performance", example: "Hot paths, connection pools", color: C.cyan },
    { icon: "⚠️", type: "Error Handling", example: "Exception recovery, fallbacks", color: C.pink },
  ];

  return (
    <>
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        opacity: titleOpacity,
      }}>
        <h2 style={{ fontSize: 48, fontWeight: 800, color: C.text, margin: 0 }}>
          ⚓ <span style={{ color: C.accent }}>Anchor Points</span> — Landmarks on Critical Code
        </h2>
        <p style={{ fontSize: 20, color: C.muted, marginTop: 8 }}>
          Human-curated, AI-enriched. Purpose, security implications, performance notes, known issues.
        </p>
      </div>

      <div style={{
        position: "absolute", top: 200, left: 80, right: 80,
        display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center",
      }}>
        {anchorTypes.map((a, i) => {
          const cardSpring = spring({
            fps, frame: frame - scene.startFrame - 40 - i * 20,
            config: { damping: 12 },
          });
          return (
            <div key={a.type} style={{
              width: 520, opacity: cardSpring,
              transform: `translateY(${(1 - cardSpring) * 30}px)`,
              background: `${a.color}0a`, border: `1px solid ${a.color}35`,
              borderRadius: 16, padding: "20px 28px",
              display: "flex", alignItems: "center", gap: 18,
            }}>
              <span style={{ fontSize: 38 }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: a.color }}>{a.type}</div>
                <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{a.example}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-sync badge */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [scene.startFrame + 280, scene.startFrame + 310], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        }),
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: `${C.accent}15`, border: `1px solid ${C.accent}40`,
          borderRadius: 30, padding: "12px 28px",
        }}>
          <span style={{ fontSize: 20 }}>🔄</span>
          <span style={{ fontSize: 18, color: C.accent, fontWeight: 600 }}>
            Critical anchors auto-sync to Copilot instructions
          </span>
        </div>
      </div>
    </>
  );
};

// ── Scene: KNOWLEDGE GRAPH ──
const GraphScene: React.FC<{ frame: number; fps: number; scene: PitchScene }> = ({ frame, fps, scene }) => {
  const titleOpacity = interpolate(frame, [scene.startFrame, scene.startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Animated graph nodes
  const graphNodes = [
    { id: "auth", label: "Auth Service", x: 960, y: 360, tier: "anchor" as const, color: C.red },
    { id: "payment", label: "Payment Core", x: 600, y: 280, tier: "anchor" as const, color: C.accent },
    { id: "retry", label: "Retry Logic", x: 380, y: 480, tier: "bridge" as const, color: C.orange },
    { id: "validation", label: "Validation", x: 1300, y: 300, tier: "anchor" as const, color: C.green },
    { id: "api", label: "API Client", x: 1100, y: 550, tier: "bridge" as const, color: C.orange },
    { id: "config", label: "Config", x: 700, y: 600, tier: "summary" as const, color: C.muted },
    { id: "models", label: "Data Models", x: 1400, y: 520, tier: "summary" as const, color: C.muted },
    { id: "token", label: "Token Gen", x: 1180, y: 200, tier: "anchor" as const, color: C.purple },
  ];

  const graphEdges = [
    { from: "payment", to: "auth" }, { from: "payment", to: "retry" },
    { from: "auth", to: "token" }, { from: "validation", to: "api" },
    { from: "api", to: "config" }, { from: "retry", to: "config" },
    { from: "api", to: "models" }, { from: "auth", to: "validation" },
    { from: "payment", to: "api" }, { from: "token", to: "validation" },
  ];

  const tierSizes = { anchor: 28, bridge: 22, summary: 18 };

  return (
    <>
      <div style={{
        position: "absolute", top: 40, left: 0, right: 0, textAlign: "center",
        opacity: titleOpacity,
      }}>
        <h2 style={{ fontSize: 46, fontWeight: 800, color: C.text, margin: 0 }}>
          🧠 Condensed Knowledge Graph
        </h2>
        <p style={{ fontSize: 20, color: C.muted, marginTop: 8 }}>
          88 nodes · 351 edges · 30 communities — built in 14 seconds
        </p>
      </div>

      {/* Graph visualization */}
      <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Edges */}
        {graphEdges.map((edge, i) => {
          const fromNode = graphNodes.find(n => n.id === edge.from)!;
          const toNode = graphNodes.find(n => n.id === edge.to)!;
          const edgeOpacity = interpolate(
            frame, [scene.startFrame + 80 + i * 12, scene.startFrame + 100 + i * 12], [0, 0.4],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <line key={i}
              x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y}
              stroke={C.accent} strokeWidth={2} opacity={edgeOpacity}
              strokeDasharray="6,4"
            />
          );
        })}

        {/* Nodes */}
        {graphNodes.map((node, i) => {
          const nodeScale = spring({
            fps, frame: frame - scene.startFrame - 40 - i * 10,
            config: { damping: 12 },
          });
          const size = tierSizes[node.tier];
          const glow = node.tier === "anchor" ? `0 0 20px ${node.color}44` : "none";
          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y}) scale(${nodeScale})`}>
              <circle r={size} fill={`${node.color}22`} stroke={node.color}
                strokeWidth={2} style={{ filter: `drop-shadow(${glow})` }} />
              <text y={size + 20} textAnchor="middle" fill={C.text}
                fontSize={14} fontWeight={600} fontFamily="system-ui">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Three-tier legend */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 40,
        opacity: interpolate(frame, [scene.startFrame + 200, scene.startFrame + 230], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        }),
      }}>
        {[
          { label: "Anchor (3× weight)", color: C.accent, desc: "Human-curated critical code" },
          { label: "Bridge (2× weight)", color: C.orange, desc: "Auto-detected connectors" },
          { label: "Summary", color: C.muted, desc: "Directory-level rollups" },
        ].map(tier => (
          <div key={tier.label} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: `${tier.color}10`, border: `1px solid ${tier.color}30`,
            borderRadius: 12, padding: "10px 20px",
          }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: tier.color }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: tier.color }}>{tier.label}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{tier.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// ── Scene: COPILOT INTEGRATION ──
const CopilotScene: React.FC<{ frame: number; fps: number; scene: PitchScene }> = ({ frame, fps, scene }) => {
  const titleOpacity = interpolate(frame, [scene.startFrame, scene.startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const tools = [
    { group: "Anchors", count: 6, tools: ["createAnchor", "searchAnchors", "getAnchorById", "listAnchors", "getAnchorsByType", "getAnchorsForFile"], color: C.accent },
    { group: "Graph", count: 7, tools: ["graphBuild", "graphSearch", "graphPath", "graphNeighbors", "graphCommunities", "graphGaps", "graphStats"], color: C.green },
    { group: "Enrichments", count: 3, tools: ["getEnrichmentMap", "searchEnrichments", "getEnrichmentForFile"], color: C.cyan },
    { group: "TSGs & Repo", count: 3, tools: ["generateTsgs", "initTsgConfig", "getRepoMap"], color: C.purple },
  ];

  return (
    <>
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        opacity: titleOpacity,
      }}>
        <h2 style={{ fontSize: 46, fontWeight: 800, color: C.text, margin: 0 }}>
          🤖 19 MCP Tools — Zero Config
        </h2>
        <p style={{ fontSize: 20, color: C.muted, marginTop: 8 }}>
          Works with Copilot, Claude, Cursor, Windsurf — any MCP client
        </p>
      </div>

      <div style={{
        position: "absolute", top: 190, left: 100, right: 100,
        display: "flex", gap: 24, justifyContent: "center",
      }}>
        {tools.map((group, gi) => {
          const groupSpring = spring({
            fps, frame: frame - scene.startFrame - 40 - gi * 25,
            config: { damping: 14 },
          });
          return (
            <div key={group.group} style={{
              flex: 1, maxWidth: 400, opacity: groupSpring,
              transform: `translateY(${(1 - groupSpring) * 40}px)`,
              background: `${group.color}08`, border: `1px solid ${group.color}30`,
              borderRadius: 16, padding: "24px 28px",
            }}>
              <div style={{
                fontSize: 22, fontWeight: 800, color: group.color, marginBottom: 4,
              }}>
                {group.group}
              </div>
              <div style={{ fontSize: 14, color: C.muted, marginBottom: 16 }}>
                {group.count} tools
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {group.tools.map((tool, ti) => {
                  const toolOpacity = interpolate(
                    frame, [scene.startFrame + 80 + gi * 25 + ti * 8, scene.startFrame + 95 + gi * 25 + ti * 8],
                    [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );
                  return (
                    <div key={tool} style={{
                      fontFamily: "monospace", fontSize: 13, color: C.text,
                      background: "#0a0a1a", borderRadius: 6, padding: "5px 12px",
                      opacity: toolOpacity,
                    }}>
                      {tool}()
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent mode badge */}
      <div style={{
        position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [scene.startFrame + 300, scene.startFrame + 330], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        }),
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          background: `${C.accent}12`, border: `1px solid ${C.accent}35`,
          borderRadius: 30, padding: "14px 32px",
        }}>
          <span style={{ fontSize: 16, color: C.accent, fontWeight: 700 }}>@anchors</span>
          <span style={{ color: C.dim }}>·</span>
          <span style={{ fontSize: 16, color: C.green, fontWeight: 700 }}>Agent Mode</span>
          <span style={{ color: C.dim }}>·</span>
          <span style={{ fontSize: 16, color: C.cyan, fontWeight: 700 }}>MCP Server</span>
        </div>
      </div>
    </>
  );
};

// ── Scene: INCIDENT RESPONSE ──
const IncidentScene: React.FC<{ frame: number; fps: number; scene: PitchScene }> = ({ frame, fps, scene }) => {
  const titleOpacity = interpolate(frame, [scene.startFrame, scene.startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const steps = [
    { icon: "🚨", label: "Alert Fires", desc: "High latency on Dependencies Validation", color: C.red, delay: 50 },
    { icon: "🔍", label: "graphSearch()", desc: "Finds DependenciesValidation at L40 instantly", color: C.accent, delay: 140 },
    { icon: "🔗", label: "graphNeighbors()", desc: "Shows API client with 120s timeout, no retry", color: C.orange, delay: 230 },
    { icon: "💥", label: "Blast Radius", desc: "All 5 validation pipelines affected", color: C.pink, delay: 320 },
    { icon: "📋", label: "Auto-Generate TSG", desc: "Code context + escalation path + past incidents", color: C.green, delay: 410 },
  ];

  return (
    <>
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        opacity: titleOpacity,
      }}>
        <h2 style={{ fontSize: 46, fontWeight: 800, color: C.text, margin: 0 }}>
          🚨 Alert → Root Cause in <span style={{ color: C.green }}>3 Minutes</span>
        </h2>
      </div>

      {/* Timeline flow */}
      <div style={{
        position: "absolute", top: 170, left: 160, right: 160,
        display: "flex", flexDirection: "column", gap: 0,
      }}>
        {steps.map((step, i) => {
          const stepSpring = spring({
            fps, frame: frame - scene.startFrame - step.delay,
            config: { damping: 14 },
          });
          return (
            <div key={i}>
              <div style={{
                display: "flex", alignItems: "center", gap: 24,
                opacity: stepSpring,
                transform: `translateX(${(1 - stepSpring) * 80}px)`,
                marginBottom: 8,
              }}>
                {/* Step number circle */}
                <div style={{
                  width: 52, height: 52, borderRadius: 26,
                  background: `${step.color}20`, border: `2px solid ${step.color}60`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}>
                  {step.icon}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1, background: `${step.color}08`,
                  border: `1px solid ${step.color}25`, borderRadius: 14,
                  padding: "16px 24px",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: step.color }}>{step.label}</div>
                  <div style={{ fontSize: 15, color: C.muted, marginTop: 4 }}>{step.desc}</div>
                </div>

                {/* Time indicator */}
                <div style={{
                  fontSize: 14, color: C.muted, fontFamily: "monospace",
                  minWidth: 60, textAlign: "right",
                }}>
                  {i === 0 ? "0:00" : `0:${String(i * 45).padStart(2, "0")}`}
                </div>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  width: 2, height: 20, background: `${C.dim}`,
                  marginLeft: 25, opacity: stepSpring,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Result banner */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [scene.startFrame + 500, scene.startFrame + 530], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        }),
      }}>
        <span style={{ fontSize: 24, color: C.green, fontWeight: 700 }}>
          ✓ 5 min to root cause
        </span>
        <span style={{ fontSize: 20, color: C.muted, marginLeft: 20 }}>
          vs. 30+ min manual investigation
        </span>
      </div>
    </>
  );
};

// ── Scene: METRICS ──
const MetricsScene: React.FC<{ frame: number; fps: number; scene: PitchScene }> = ({ frame, fps, scene }) => {
  const titleOpacity = interpolate(frame, [scene.startFrame, scene.startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const metrics = [
    { number: "16×", label: "Fewer tokens per question", color: C.accent },
    { number: "99.8%", label: "Context reduction", color: C.green },
    { number: "14s", label: "Graph build time", color: C.cyan },
    { number: "1", label: "Tool call vs. 5-7", color: C.orange },
    { number: "19", label: "MCP tools, zero config", color: C.purple },
    { number: "15", label: "Languages supported", color: C.pink },
  ];

  return (
    <>
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        opacity: titleOpacity,
      }}>
        <h2 style={{ fontSize: 46, fontWeight: 800, color: C.text, margin: 0 }}>
          📊 Impact by the Numbers
        </h2>
      </div>

      <div style={{
        position: "absolute", top: 180, left: 120, right: 120,
        display: "flex", flexWrap: "wrap", gap: 30, justifyContent: "center",
      }}>
        {metrics.map((m, i) => {
          const metricSpring = spring({
            fps, frame: frame - scene.startFrame - 40 - i * 20,
            config: { damping: 10, stiffness: 100 },
          });
          return (
            <div key={m.label} style={{
              width: 480, opacity: metricSpring,
              transform: `scale(${0.8 + metricSpring * 0.2})`,
              background: `${m.color}08`, border: `1px solid ${m.color}30`,
              borderRadius: 20, padding: "30px 36px",
              display: "flex", alignItems: "center", gap: 24,
            }}>
              <div style={{
                fontSize: 56, fontWeight: 900, color: m.color,
                fontFamily: "monospace", minWidth: 140, textAlign: "center",
                textShadow: `0 0 25px ${m.color}44`,
              }}>
                {m.number}
              </div>
              <div style={{ fontSize: 20, color: C.text, fontWeight: 500 }}>
                {m.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Token funnel visualization */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 8, alignItems: "flex-end",
        opacity: interpolate(frame, [scene.startFrame + 250, scene.startFrame + 280], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        }),
      }}>
        {[
          { label: "Source", value: "420K", height: 100, color: C.red },
          { label: "Symbols", value: "52K", height: 60, color: C.orange },
          { label: "Graph", value: "8K", height: 30, color: C.accent },
          { label: "Query", value: "800", height: 8, color: C.green },
        ].map((bar) => (
          <div key={bar.label} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 12, color: bar.color, fontWeight: 700, marginBottom: 4,
            }}>
              {bar.value}
            </div>
            <div style={{
              width: 100, height: bar.height, background: `${bar.color}40`,
              border: `1px solid ${bar.color}60`, borderRadius: 6,
            }} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{bar.label}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// ── Scene: CLOSING ──
const ClosingScene: React.FC<{ frame: number; fps: number; scene: PitchScene }> = ({ frame, fps, scene }) => {
  const logoScale = spring({
    fps, frame: frame - scene.startFrame,
    config: { damping: 10 },
  });

  const features = [
    "⚓ Anchor Points", "🧠 Knowledge Graph", "🤖 19 MCP Tools",
    "📋 Auto TSGs", "📝 File Enrichments", "💬 Code Comments",
  ];

  const ctaOpacity = interpolate(frame, [scene.startFrame + 300, scene.startFrame + 340], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const ringPulse = Math.sin(frame * 0.04) * 0.4 + 0.6;

  return (
    <>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* Logo */}
        <div style={{
          width: 140, height: 140, borderRadius: "50%",
          border: `3px solid ${C.accent}`,
          boxShadow: `0 0 ${50 * ringPulse}px ${C.accent}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${logoScale})`, marginBottom: 30,
        }}>
          <span style={{ fontSize: 60 }}>⚓</span>
        </div>

        <h1 style={{
          fontSize: 64, fontWeight: 900, color: C.text, margin: 0,
          letterSpacing: -2, textShadow: `0 0 40px ${C.accent}66`,
        }}>
          CodeMarker
        </h1>

        <p style={{
          fontSize: 24, color: C.accent2, margin: "12px 0 0 0",
          fontWeight: 500,
        }}>
          Pre-compute once. Query forever.
        </p>

        {/* Feature pills */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center",
          marginTop: 40, maxWidth: 900,
        }}>
          {features.map((f, i) => {
            const pillSpring = spring({
              fps, frame: frame - scene.startFrame - 120 - i * 15,
              config: { damping: 12 },
            });
            return (
              <div key={f} style={{
                background: `${C.accent}12`, border: `1px solid ${C.accent}30`,
                borderRadius: 20, padding: "10px 22px",
                fontSize: 16, color: C.text, fontWeight: 600,
                opacity: pillSpring,
                transform: `translateY(${(1 - pillSpring) * 15}px)`,
              }}>
                {f}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 50, opacity: ctaOpacity, textAlign: "center" }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
            borderRadius: 16, padding: "18px 48px",
            display: "inline-block",
          }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
              Install from VS Code Marketplace
            </span>
          </div>
          <p style={{ fontSize: 16, color: C.muted, marginTop: 16 }}>
            Open source · Works with any MCP client · 15 languages
          </p>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// Main Composition
// ═══════════════════════════════════════════════════════════
export const CodeMarkerPitch: React.FC<{
  narrationSrc?: string;
  bgmSrc?: string;
}> = ({ narrationSrc, bgmSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentScene = getScene(frame);

  // Scene transitions — fade between scenes
  const sceneData = SCENES.find(s => s.id === currentScene)!;
  const fadeIn = interpolate(frame, [sceneData.startFrame, sceneData.startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: C.bg,
      fontFamily: "system-ui, -apple-system, sans-serif",
      overflow: "hidden",
    }}>
      {/* Audio */}
      {narrationSrc && <Audio src={narrationSrc} volume={1} />}
      {bgmSrc && <Audio src={bgmSrc} volume={0.08} />}

      {/* Particles */}
      <Particles frame={frame} />

      {/* Scene content with fade */}
      <div style={{ opacity: fadeIn }}>
        {currentScene === "hook" && <HookScene frame={frame} fps={fps} />}
        {currentScene === "problem" && <ProblemScene frame={frame} fps={fps} scene={sceneData} />}
        {currentScene === "solution" && <SolutionScene frame={frame} fps={fps} scene={sceneData} />}
        {currentScene === "anchors" && <AnchorsScene frame={frame} fps={fps} scene={sceneData} />}
        {currentScene === "graph" && <GraphScene frame={frame} fps={fps} scene={sceneData} />}
        {currentScene === "copilot" && <CopilotScene frame={frame} fps={fps} scene={sceneData} />}
        {currentScene === "incident" && <IncidentScene frame={frame} fps={fps} scene={sceneData} />}
        {currentScene === "metrics" && <MetricsScene frame={frame} fps={fps} scene={sceneData} />}
        {currentScene === "closing" && <ClosingScene frame={frame} fps={fps} scene={sceneData} />}
      </div>

      {/* Frame counter */}
      <div style={{
        position: "absolute", bottom: 12, right: 18,
        fontSize: 11, color: "#1e293b", fontFamily: "monospace",
      }}>
        {Math.floor(frame / fps)}s · f{frame}
      </div>
    </AbsoluteFill>
  );
};
