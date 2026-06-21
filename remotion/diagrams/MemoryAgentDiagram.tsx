import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const W = 1920;
const H = 1080;
const ACCENT = "#f43f5e";
const BG = "linear-gradient(135deg, #1a0010 0%, #4c0519 55%, #881337 100%)";

function spr(frame: number, from: number, fps: number) {
  return spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 80 } });
}

const WORKING_MEM = [
  "User asked about RAG systems",
  "Last tool: web_search",
  "Found 3 relevant papers",
  "Drafted section outline",
];

const VECTOR_ENTRIES = [
  "chunk_001: RAG overview",
  "chunk_042: retrieval methods",
  "chunk_098: vector stores",
  "chunk_134: embedding models",
];

export const MemoryAgentDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: D } = useVideoConfig();

  const queryAt  = Math.round(D * 0.04);
  const llmAt    = Math.round(D * 0.13);
  const wmAt     = Math.round(D * 0.22);
  const vsAt     = Math.round(D * 0.31);
  const arrowAt  = Math.round(D * 0.42);
  const respAt   = Math.round(D * 0.65);

  // Positions
  const queryX = 960, queryY = 170, queryW = 380, queryH = 80;
  const llmX = 960, llmY = 490, llmW = 300, llmH = 100;
  const wmX = 180, wmY = 380, wmW = 310, wmH = 300;
  const vsX = 1430, vsY = 380, vsW = 310, vsH = 300;
  const respX = 960, respY = 850, respW = 380, respH = 80;

  // Beam animation: LLM retrieves from working memory and vector store
  const beamProgress = (at: number) =>
    interpolate(frame, [at, at + 30], [0, 1], { extrapolateRight: "clamp" });

  // Which memory entries are highlighted
  const wmHighlight = frame >= arrowAt
    ? Math.floor(((frame - arrowAt) / Math.max(1, D * 0.08))) % WORKING_MEM.length
    : -1;
  const vsHighlight = frame >= arrowAt + 15
    ? Math.floor(((frame - arrowAt - 15) / Math.max(1, D * 0.08))) % VECTOR_ENTRIES.length
    : -1;

  const respS = spr(frame, respAt, fps);

  const arrowLen1 = Math.sqrt((llmX - wmX - wmW) ** 2 + (llmY - wmY - wmH / 2) ** 2);
  const arrowLen2 = Math.sqrt((vsX - llmX - llmW / 2) ** 2 + (llmY - vsY - vsH / 2) ** 2);

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
          Memory-Augmented Agents
        </div>
        <div style={{ fontSize: 20, color: "#fda4af", marginTop: 6 }}>
          Short-term context + long-term vector retrieval
        </div>
      </div>

      {/* SVG beams */}
      <svg style={{ position: "absolute", inset: 0, width: W, height: H, overflow: "visible" }}>
        <defs>
          <marker id="ah-mem" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={ACCENT} />
          </marker>
          <marker id="ah-mem-b" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#fb7185" />
          </marker>
        </defs>

        {/* Query → LLM */}
        {frame >= queryAt && (
          <line x1={queryX} y1={queryY + 40} x2={llmX} y2={llmY - 50}
            stroke={ACCENT} strokeWidth={2.5} opacity={0.55}
            strokeDasharray={360} strokeDashoffset={360 * (1 - beamProgress(queryAt + 10))}
            markerEnd="url(#ah-mem)" />
        )}
        {/* LLM → Working Memory (bidirectional) */}
        {frame >= arrowAt && (
          <>
            <line x1={llmX - 150} y1={llmY} x2={wmX + wmW} y2={wmY + wmH / 2}
              stroke={ACCENT} strokeWidth={2} opacity={0.45}
              strokeDasharray={arrowLen1}
              strokeDashoffset={arrowLen1 * (1 - beamProgress(arrowAt))}
              markerEnd="url(#ah-mem)" />
            <line x1={wmX + wmW} y1={wmY + wmH / 2 + 20} x2={llmX - 150} y2={llmY + 20}
              stroke="#fb7185" strokeWidth={2} opacity={0.45}
              strokeDasharray={arrowLen1}
              strokeDashoffset={arrowLen1 * (1 - beamProgress(arrowAt + 12))}
              markerEnd="url(#ah-mem-b)" />
          </>
        )}
        {/* LLM ↔ Vector Store */}
        {frame >= arrowAt + 6 && (
          <>
            <line x1={llmX + 150} y1={llmY} x2={vsX} y2={vsY + vsH / 2}
              stroke={ACCENT} strokeWidth={2} opacity={0.45}
              strokeDasharray={arrowLen2}
              strokeDashoffset={arrowLen2 * (1 - beamProgress(arrowAt + 6))}
              markerEnd="url(#ah-mem)" />
            <line x1={vsX} y1={vsY + vsH / 2 + 20} x2={llmX + 150} y2={llmY + 20}
              stroke="#fb7185" strokeWidth={2} opacity={0.45}
              strokeDasharray={arrowLen2}
              strokeDashoffset={arrowLen2 * (1 - beamProgress(arrowAt + 18))}
              markerEnd="url(#ah-mem-b)" />
          </>
        )}
        {/* LLM → Response */}
        {frame >= respAt - 15 && (
          <line x1={llmX} y1={llmY + 50} x2={respX} y2={respY - 40}
            stroke="#fb7185" strokeWidth={2.5} opacity={0.55}
            strokeDasharray={360}
            strokeDashoffset={360 * (1 - beamProgress(respAt - 15))}
            markerEnd="url(#ah-mem-b)" />
        )}
      </svg>

      {/* Query box */}
      {frame >= queryAt && (
        <div style={{
          position: "absolute",
          left: queryX - queryW / 2, top: queryY - queryH / 2,
          width: queryW, height: queryH,
          transform: `scale(${spr(frame, queryAt, fps)})`, transformOrigin: "center",
          opacity: Math.min(1, spr(frame, queryAt, fps) * 1.5),
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          background: "rgba(244,63,94,0.12)", border: "2px solid #f43f5e",
          borderRadius: 16, boxShadow: "0 0 24px #f43f5e44",
        }}>
          <span style={{ fontSize: 28 }}>💬</span>
          <span style={{ color: "white", fontSize: 19, fontWeight: 600 }}>User Query</span>
        </div>
      )}

      {/* LLM box */}
      <div style={{
        position: "absolute",
        left: llmX - llmW / 2, top: llmY - llmH / 2,
        width: llmW, height: llmH,
        transform: `scale(${spr(frame, llmAt, fps)})`, transformOrigin: "center",
        opacity: Math.min(1, spr(frame, llmAt, fps) * 1.5),
        display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        background: "rgba(244,63,94,0.12)", border: "2px solid #f43f5e",
        borderRadius: 20, boxShadow: "0 0 40px #f43f5e66",
      }}>
        <span style={{ fontSize: 36 }}>🧠</span>
        <div>
          <div style={{ color: "#fda4af", fontSize: 14 }}>LLM Agent</div>
          <div style={{ color: "white", fontSize: 21, fontWeight: 700 }}>Reason & Generate</div>
        </div>
      </div>

      {/* Working Memory panel */}
      {frame >= wmAt && (
        <div style={{
          position: "absolute",
          left: wmX, top: wmY,
          width: wmW, height: wmH,
          opacity: Math.min(1, spr(frame, wmAt, fps) * 1.5),
          background: "rgba(255,255,255,0.05)",
          border: "2px solid #fb718566",
          borderRadius: 16, padding: 16,
          boxShadow: "0 0 20px #fb718522",
        }}>
          <div style={{ color: "#fda4af", fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
            📝 Working Memory
          </div>
          {WORKING_MEM.map((entry, i) => (
            <div key={i} style={{
              padding: "6px 10px", marginBottom: 6,
              background: wmHighlight === i ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${wmHighlight === i ? "#f43f5e" : "transparent"}`,
              borderRadius: 8,
              color: wmHighlight === i ? "white" : "#fda4af",
              fontSize: 14,
              transition: "none",
            }}>
              {entry}
            </div>
          ))}
        </div>
      )}

      {/* Vector Store panel */}
      {frame >= vsAt && (
        <div style={{
          position: "absolute",
          left: vsX, top: vsY,
          width: vsW, height: vsH,
          opacity: Math.min(1, spr(frame, vsAt, fps) * 1.5),
          background: "rgba(255,255,255,0.05)",
          border: "2px solid #fb718566",
          borderRadius: 16, padding: 16,
          boxShadow: "0 0 20px #fb718522",
        }}>
          <div style={{ color: "#fda4af", fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
            🗄️ Vector Store
          </div>
          {VECTOR_ENTRIES.map((entry, i) => (
            <div key={i} style={{
              padding: "6px 10px", marginBottom: 6,
              background: vsHighlight === i ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${vsHighlight === i ? "#f43f5e" : "transparent"}`,
              borderRadius: 8,
              color: vsHighlight === i ? "white" : "#fda4af",
              fontSize: 14,
            }}>
              {entry}
            </div>
          ))}
        </div>
      )}

      {/* Response box */}
      {frame >= respAt && (
        <div style={{
          position: "absolute",
          left: respX - respW / 2, top: respY - respH / 2,
          width: respW, height: respH,
          transform: `scale(${respS})`, transformOrigin: "center",
          opacity: Math.min(1, respS * 1.5),
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          background: "rgba(251,113,133,0.12)", border: "2px solid #fb7185",
          borderRadius: 16, boxShadow: "0 0 24px #fb718544",
        }}>
          <span style={{ fontSize: 28 }}>💡</span>
          <span style={{ color: "white", fontSize: 19, fontWeight: 600 }}>Grounded Response</span>
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [respAt + 20, respAt + 40], [0, 1], { extrapolateRight: "clamp" }),
        color: "#fda4af", fontSize: 20,
      }}>
        Memory gives the agent context across turns and beyond the context window
      </div>
    </AbsoluteFill>
  );
};
