import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { getEntityColor } from "../designTokens";

// ── Database category type ──
interface DbCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  databases: { name: string; logo: string }[];
  useCases: string[];
  description: string;
  appearAt: number; // frame when this category appears
}

const CATEGORY_COLORS = {
  relational: getEntityColor("postgresql", "primary"),
  document: getEntityColor("mongodb", "primary"),
  keyvalue: getEntityColor("redis", "primary"),
  columnar: "#f59e0b",
  graph: "#8b5cf6",
  search: getEntityColor("elasticsearch", "primary"),
  timeseries: "#06b6d4",
  vector: "#a855f7",
} as const;

// ── 8 major database categories ──
// Total video ~297s = 8901 frames @ 30fps
// Each category gets ~33s (990 frames), summary/decision at end
const CATEGORIES: DbCategory[] = [
  {
    id: "relational",
    label: "Relational (SQL)",
    icon: "🏛️",
    color: CATEGORY_COLORS.relational,
    databases: [
      { name: "PostgreSQL", logo: "🐘" },
      { name: "MySQL", logo: "🐬" },
      { name: "SQL Server", logo: "🔷" },
      { name: "Oracle", logo: "🔴" },
    ],
    useCases: [
      "Transactional systems (OLTP)",
      "Financial records & banking",
      "E-commerce order management",
      "Complex joins & relationships",
    ],
    description: "ACID-compliant, structured schemas, SQL queries",
    appearAt: 150, // ~5s
  },
  {
    id: "document",
    label: "Document Store",
    icon: "📄",
    color: CATEGORY_COLORS.document,
    databases: [
      { name: "MongoDB", logo: "🍃" },
      { name: "CouchDB", logo: "🛋️" },
      { name: "Firestore", logo: "🔥" },
    ],
    useCases: [
      "Content management systems",
      "User profiles & catalogs",
      "Real-time apps & mobile backends",
      "Semi-structured / nested data",
    ],
    description: "Schema-flexible, JSON/BSON documents, horizontal scaling",
    appearAt: 1140, // ~38s
  },
  {
    id: "keyvalue",
    label: "Key-Value Store",
    icon: "🔑",
    color: CATEGORY_COLORS.keyvalue,
    databases: [
      { name: "Redis", logo: "🔴" },
      { name: "DynamoDB", logo: "⚡" },
      { name: "Memcached", logo: "💾" },
    ],
    useCases: [
      "Session management & caching",
      "Shopping carts & rate limiting",
      "Leaderboards & counters",
      "Feature flags & config",
    ],
    description: "Ultra-fast lookups, simple data model, in-memory option",
    appearAt: 2130, // ~71s
  },
  {
    id: "columnar",
    label: "Wide-Column / Columnar",
    icon: "📊",
    color: CATEGORY_COLORS.columnar,
    databases: [
      { name: "Cassandra", logo: "👁️" },
      { name: "HBase", logo: "🐝" },
      { name: "ScyllaDB", logo: "🦂" },
    ],
    useCases: [
      "Time-series & IoT data",
      "Write-heavy workloads",
      "Analytics & event logging",
      "Multi-datacenter replication",
    ],
    description: "Partitioned rows, column families, massive write throughput",
    appearAt: 3120, // ~104s
  },
  {
    id: "graph",
    label: "Graph Database",
    icon: "🔗",
    color: CATEGORY_COLORS.graph,
    databases: [
      { name: "Neo4j", logo: "🌐" },
      { name: "Amazon Neptune", logo: "🔱" },
      { name: "ArangoDB", logo: "🥑" },
    ],
    useCases: [
      "Social networks & recommendations",
      "Fraud detection & identity graphs",
      "Knowledge graphs & ontologies",
      "Network topology mapping",
    ],
    description: "Nodes, edges, traversals — relationship-first queries",
    appearAt: 4110, // ~137s
  },
  {
    id: "search",
    label: "Search Engine",
    icon: "🔍",
    color: CATEGORY_COLORS.search,
    databases: [
      { name: "Elasticsearch", logo: "🔎" },
      { name: "OpenSearch", logo: "📡" },
      { name: "Typesense", logo: "⚡" },
    ],
    useCases: [
      "Full-text search & autocomplete",
      "Log aggregation & monitoring",
      "Product search & filtering",
      "Geospatial queries",
    ],
    description: "Inverted indexes, relevance scoring, near-real-time",
    appearAt: 5100, // ~170s
  },
  {
    id: "timeseries",
    label: "Time-Series Database",
    icon: "⏱️",
    color: CATEGORY_COLORS.timeseries,
    databases: [
      { name: "InfluxDB", logo: "📈" },
      { name: "TimescaleDB", logo: "🕐" },
      { name: "Prometheus", logo: "🔥" },
    ],
    useCases: [
      "Server & app metrics",
      "Financial tick data",
      "IoT sensor streams",
      "Downsampling & retention policies",
    ],
    description: "Optimized for time-stamped data, compression, rollups",
    appearAt: 6090, // ~203s
  },
  {
    id: "vector",
    label: "Vector Database",
    icon: "🧬",
    color: CATEGORY_COLORS.vector,
    databases: [
      { name: "Pinecone", logo: "🌲" },
      { name: "Weaviate", logo: "🧱" },
      { name: "pgvector", logo: "🐘" },
      { name: "Milvus", logo: "🐋" },
    ],
    useCases: [
      "Semantic search & RAG",
      "Image / audio similarity",
      "Recommendation engines",
      "LLM memory & embeddings",
    ],
    description: "High-dimensional similarity search, ANN indexes",
    appearAt: 7080, // ~236s
  },
];

// Decision guide connections shown at the end
const DECISION_GUIDE = [
  { need: "ACID transactions", pick: "Relational", color: CATEGORY_COLORS.relational, appearAt: 8070 },
  { need: "Flexible schema", pick: "Document", color: CATEGORY_COLORS.document, appearAt: 8120 },
  { need: "Sub-ms latency", pick: "Key-Value", color: CATEGORY_COLORS.keyvalue, appearAt: 8170 },
  { need: "Massive writes", pick: "Wide-Column", color: CATEGORY_COLORS.columnar, appearAt: 8220 },
  { need: "Relationships", pick: "Graph", color: CATEGORY_COLORS.graph, appearAt: 8270 },
  { need: "Full-text search", pick: "Search Engine", color: CATEGORY_COLORS.search, appearAt: 8320 },
  { need: "Metrics & time data", pick: "Time-Series", color: CATEGORY_COLORS.timeseries, appearAt: 8370 },
  { need: "AI embeddings", pick: "Vector", color: CATEGORY_COLORS.vector, appearAt: 8420 },
];

// Layout: 2 columns × 4 rows grid for the 8 categories
const GRID_POSITIONS: { x: number; y: number }[] = [
  { x: 80, y: 160 },   // Relational
  { x: 980, y: 160 },  // Document
  { x: 80, y: 380 },   // Key-Value
  { x: 980, y: 380 },  // Columnar
  { x: 80, y: 600 },   // Graph
  { x: 980, y: 600 },  // Search
  { x: 80, y: 820 },   // Time-Series (shows in summary phase)
  { x: 980, y: 820 },  // Vector (shows in summary phase)
];

// ── Card dimensions for detail view ──
const DETAIL_CARD = { width: 860, height: 520, x: 530, y: 280 };

export const DatabaseTypes: React.FC<{
  narrationSrc?: string;
  bgmSrc?: string;
}> = ({ narrationSrc, bgmSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleScale = spring({ fps, frame, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 1: Each category gets a detailed card (frames 150 – 8010)
  // Phase 2: Summary grid + decision guide (frames 8010 – 8901)
  const summaryPhase = frame >= 8010;

  // Find current active category for detail view
  const activeIndex = CATEGORIES.reduce((acc, cat, i) => {
    if (frame >= cat.appearAt) return i;
    return acc;
  }, -1);

  const activeCat = activeIndex >= 0 ? CATEGORIES[activeIndex] : null;
  const nextCat = activeIndex < CATEGORIES.length - 1 ? CATEGORIES[activeIndex + 1] : null;
  const categoryEndFrame = nextCat ? nextCat.appearAt : 8010;

  // Detail card animation
  const detailProgress = activeCat
    ? spring({
        fps,
        frame: frame - activeCat.appearAt,
        config: { damping: 14, stiffness: 120 },
      })
    : 0;

  // Fade near end of category section
  const detailFade =
    activeCat && !summaryPhase
      ? interpolate(frame, [categoryEndFrame - 30, categoryEndFrame], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Summary grid animation
  const summaryProgress = summaryPhase
    ? interpolate(frame, [8010, 8070], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Closing text
  const closingOpacity = interpolate(frame, [8550, 8610], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        fontFamily: "system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Audio */}
      {narrationSrc && <Audio src={narrationSrc} volume={1} />}
      {bgmSrc && <Audio src={bgmSrc} volume={0.1} />}

      {/* Animated background grid */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.06 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 96}
            y1={0}
            x2={i * 96}
            y2={1080}
            stroke="#6366f1"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * 90}
            x2={1920}
            y2={i * 90}
            stroke="#6366f1"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <h1
          style={{
            fontSize: summaryPhase ? 36 : 48,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            letterSpacing: -1,
            transition: "font-size 0.3s",
          }}
        >
          🗄️ Types of Databases
        </h1>
        <p
          style={{
            fontSize: 20,
            color: "#94a3b8",
            margin: "6px 0 0 0",
            opacity: interpolate(frame, [20, 45], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Choosing the right database for the job
        </p>
      </div>

      {/* ── Phase 1: Category counter + detail card ── */}
      {!summaryPhase && activeCat && (
        <>
          {/* Category counter — top right */}
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 60,
              fontSize: 18,
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            {activeIndex + 1} / {CATEGORIES.length}
          </div>

          {/* Mini nav dots */}
          <div
            style={{
              position: "absolute",
              top: 110,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.id}
                style={{
                  width: i === activeIndex ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: i <= activeIndex ? cat.color : "#1e293b",
                  opacity: i <= activeIndex ? 1 : 0.4,
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Detail card */}
          <div
            style={{
              position: "absolute",
              left: DETAIL_CARD.x,
              top: DETAIL_CARD.y,
              width: DETAIL_CARD.width,
              transform: `translateX(${(1 - detailProgress) * 80}px) scale(${0.9 + detailProgress * 0.1})`,
              opacity: detailProgress * detailFade,
            }}
          >
            {/* Card header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${activeCat.color}22, ${activeCat.color}08)`,
                border: `2px solid ${activeCat.color}55`,
                borderRadius: 20,
                padding: "36px 44px",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Icon + label */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <span style={{ fontSize: 52 }}>{activeCat.icon}</span>
                <div>
                  <h2
                    style={{
                      fontSize: 38,
                      fontWeight: 800,
                      color: activeCat.color,
                      margin: 0,
                    }}
                  >
                    {activeCat.label}
                  </h2>
                  <p style={{ fontSize: 16, color: "#94a3b8", margin: "4px 0 0 0" }}>
                    {activeCat.description}
                  </p>
                </div>
              </div>

              {/* Database logos row */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 20,
                  marginBottom: 28,
                }}
              >
                {activeCat.databases.map((db, i) => {
                  const dbAppear = spring({
                    fps,
                    frame: frame - activeCat.appearAt - 15 - i * 8,
                    config: { damping: 12 },
                  });
                  return (
                    <div
                      key={db.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: 12,
                        padding: "10px 18px",
                        opacity: dbAppear,
                        transform: `translateY(${(1 - dbAppear) * 20}px)`,
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{db.logo}</span>
                      <span style={{ fontSize: 15, color: "#e2e8f0", fontWeight: 600 }}>
                        {db.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Use cases */}
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#cbd5e1",
                  margin: "0 0 12px 0",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Use Cases
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {activeCat.useCases.map((uc, i) => {
                  const ucAppear = spring({
                    fps,
                    frame: frame - activeCat.appearAt - 40 - i * 10,
                    config: { damping: 12 },
                  });
                  return (
                    <div
                      key={uc}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        opacity: ucAppear,
                        transform: `translateX(${(1 - ucAppear) * 40}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: activeCat.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 18, color: "#e2e8f0" }}>{uc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side mini-cards for already shown categories */}
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 200,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {CATEGORIES.slice(0, activeIndex).map((cat) => {
              const miniOpacity = interpolate(
                frame,
                [cat.appearAt + 100, cat.appearAt + 130],
                [0, 0.7],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={cat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}30`,
                    borderRadius: 10,
                    padding: "8px 14px",
                    opacity: miniOpacity,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 13, color: cat.color, fontWeight: 600 }}>
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Phase 2: Summary grid ── */}
      {summaryPhase && (
        <>
          {/* 2×4 grid of all categories */}
          {CATEGORIES.map((cat, i) => {
            const gridPos = GRID_POSITIONS[i];
            const cardSpring = spring({
              fps,
              frame: frame - 8010 - i * 5,
              config: { damping: 14 },
            });
            return (
              <div
                key={cat.id}
                style={{
                  position: "absolute",
                  left: gridPos.x,
                  top: gridPos.y,
                  width: 860,
                  opacity: cardSpring * summaryProgress,
                  transform: `scale(${0.85 + cardSpring * 0.15})`,
                }}
              >
                <div
                  style={{
                    background: `${cat.color}12`,
                    border: `1px solid ${cat.color}40`,
                    borderRadius: 14,
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: 30 }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: cat.color }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                      {cat.databases.map((d) => d.name).join(" · ")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Decision guide — "When to pick what" */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "0 60px",
            }}
          >
            {DECISION_GUIDE.map((item) => {
              const pillOpacity = interpolate(
                frame,
                [item.appearAt, item.appearAt + 20],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={item.need}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}40`,
                    borderRadius: 20,
                    padding: "8px 16px",
                    opacity: pillOpacity,
                    transform: `translateY(${(1 - pillOpacity) * 15}px)`,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.need}</span>
                  <span style={{ fontSize: 12, color: "#475569" }}>→</span>
                  <span style={{ fontSize: 13, color: item.color, fontWeight: 700 }}>
                    {item.pick}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Closing line */}
          <div
            style={{
              position: "absolute",
              bottom: 100,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: closingOpacity,
            }}
          >
            <p style={{ fontSize: 22, color: "#cbd5e1", fontWeight: 600 }}>
              Most real systems use <span style={{ color: "#6366f1" }}>polyglot persistence</span> —
              multiple databases, each for its strength.
            </p>
          </div>
        </>
      )}

      {/* Frame counter — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: 15,
          right: 20,
          fontSize: 11,
          color: "#334155",
          fontFamily: "monospace",
        }}
      >
        {Math.floor(frame / fps)}s · f{frame}
      </div>
    </AbsoluteFill>
  );
};
