import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface Node {
  id: string;
  label: string;
  role: "client" | "gateway" | "compute" | "queue" | "cache" | "storage" | "monitor";
  icon: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  appearAt: number;
  description: string;
}

interface Connection {
  from: string;
  to: string;
  label: string;
  color: string;
  appearAt: number;
  trafficType: "request" | "cache-check" | "event" | "db-write" | "replication" | "failure";
}

interface MetricPanel {
  label: string;
  value: string;
  unit: string;
  color: string;
}

const NODES: Node[] = [
  {
    id: "client",
    label: "Global Client",
    role: "client",
    icon: "🌐",
    color: "#60a5fa",
    x: 50,
    y: 360,
    width: 200,
    height: 100,
    appearAt: 0,
    description: "User requests originate here",
  },
  {
    id: "loadbalancer",
    label: "Load Balancer",
    role: "gateway",
    icon: "⚖️",
    color: "#a78bfa",
    x: 320,
    y: 360,
    width: 220,
    height: 100,
    appearAt: 60,
    description: "Distributes incoming traffic",
  },
  {
    id: "service1",
    label: "Service (A)",
    role: "compute",
    icon: "⚙️",
    color: "#2dd4bf",
    x: 640,
    y: 120,
    width: 240,
    height: 100,
    appearAt: 120,
    description: "Stateless API instance",
  },
  {
    id: "service2",
    label: "Service (B)",
    role: "compute",
    icon: "⚙️",
    color: "#2dd4bf",
    x: 640,
    y: 280,
    width: 240,
    height: 100,
    appearAt: 140,
    description: "Stateless API instance",
  },
  {
    id: "cache",
    label: "Cache Tier",
    role: "cache",
    icon: "⚡",
    color: "#f59e0b",
    x: 640,
    y: 520,
    width: 240,
    height: 100,
    appearAt: 160,
    description: "Redis / Memcached layer",
  },
  {
    id: "eventqueue",
    label: "Event Queue",
    role: "queue",
    icon: "📬",
    color: "#fb7185",
    x: 990,
    y: 120,
    width: 220,
    height: 100,
    appearAt: 200,
    description: "Async event broker",
  },
  {
    id: "workers",
    label: "Background Workers",
    role: "queue",
    icon: "⏳",
    color: "#34d399",
    x: 990,
    y: 280,
    width: 220,
    height: 100,
    appearAt: 240,
    description: "Async task processors",
  },
  {
    id: "primarydb",
    label: "Primary DB",
    role: "storage",
    icon: "🗄️",
    color: "#22c55e",
    x: 1320,
    y: 120,
    width: 220,
    height: 100,
    appearAt: 300,
    description: "Single source of truth",
  },
  {
    id: "replicadb",
    label: "Replica DB",
    role: "storage",
    icon: "🪞",
    color: "#14b8a6",
    x: 1320,
    y: 280,
    width: 220,
    height: 100,
    appearAt: 340,
    description: "Read-only copy (eventual consistency)",
  },
  {
    id: "monitoring",
    label: "Observability",
    role: "monitor",
    icon: "📊",
    color: "#f97316",
    x: 1650,
    y: 200,
    width: 200,
    height: 100,
    appearAt: 380,
    description: "Metrics, logs, traces",
  },
];

const CONNECTIONS: Connection[] = [
  {
    from: "client",
    to: "loadbalancer",
    label: "request",
    color: "#60a5fa",
    appearAt: 420,
    trafficType: "request",
  },
  {
    from: "loadbalancer",
    to: "service1",
    label: "route",
    color: "#a78bfa",
    appearAt: 480,
    trafficType: "request",
  },
  {
    from: "loadbalancer",
    to: "service2",
    label: "route",
    color: "#a78bfa",
    appearAt: 510,
    trafficType: "request",
  },
  {
    from: "service1",
    to: "cache",
    label: "check",
    color: "#f59e0b",
    appearAt: 570,
    trafficType: "cache-check",
  },
  {
    from: "service2",
    to: "cache",
    label: "check",
    color: "#f59e0b",
    appearAt: 600,
    trafficType: "cache-check",
  },
  {
    from: "service1",
    to: "eventqueue",
    label: "publish",
    color: "#fb7185",
    appearAt: 660,
    trafficType: "event",
  },
  {
    from: "eventqueue",
    to: "workers",
    label: "consume",
    color: "#34d399",
    appearAt: 720,
    trafficType: "event",
  },
  {
    from: "service1",
    to: "primarydb",
    label: "write",
    color: "#22c55e",
    appearAt: 780,
    trafficType: "db-write",
  },
  {
    from: "primarydb",
    to: "replicadb",
    label: "replicate",
    color: "#14b8a6",
    appearAt: 840,
    trafficType: "replication",
  },
  {
    from: "service2",
    to: "replicadb",
    label: "read",
    color: "#38bdf8",
    appearAt: 900,
    trafficType: "replication",
  },
];

const METRICS: MetricPanel[] = [
  { label: "Latency (p99)", value: "142ms", unit: "milliseconds", color: "#60a5fa" },
  { label: "Cache Hit", value: "91%", unit: "percent", color: "#f59e0b" },
  { label: "Queue Depth", value: "8", unit: "events", color: "#fb7185" },
  { label: "Replica Lag", value: "230ms", unit: "milliseconds", color: "#14b8a6" },
];

const centerOf = (node: Node) => ({
  x: node.x + node.width / 2,
  y: node.y + node.height / 2,
});

const getNode = (id: string) => {
  const node = NODES.find((n) => n.id === id);
  if (!node) {
    console.warn(`Node not found: ${id}`);
  }
  return node!;
};

const packetPosition = (fromId: string, toId: string, progress: number) => {
  const from = centerOf(getNode(fromId));
  const to = centerOf(getNode(toId));
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  };
};

export const DistributedSystemsMap: React.FC<{
}> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  try {
    // Animation timing
    const titleScale = spring({ fps, frame, config: { damping: 12, stiffness: 110 } });
    const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Pulsing glow effect
    const pulsePhase = Math.sin(frame * 0.08) * 0.5 + 0.5;

    // Intro panel
    const introPanelOpacity = interpolate(frame, [40, 70], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Failure visualization
    const failureOpacity = interpolate(frame, [960, 1020, 1080, 1140], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Metrics footer
    const metricsOpacity = interpolate(frame, [1150, 1190], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #111827 50%, #020617 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "#e5eefb",
          overflow: "hidden",
        }}
      >

      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.4,
        }}
      />

      {/* Title */}
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
        <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1.2 }}>
          Distributed Systems
        </div>
        <div style={{ fontSize: 20, color: "#60a5fa", marginTop: 6, opacity: subtitleOpacity }}>
          A visual journey through request flows, caching, queues, and data replication
        </div>
      </div>

      {/* Intro explanation panel */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 60,
          width: 380,
          padding: "20px 24px",
          borderRadius: 20,
          background: "linear-gradient(180deg, rgba(30,41,59,0.9), rgba(15,23,42,0.85))",
          border: "1px solid rgba(96,165,250,0.3)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          opacity: introPanelOpacity,
          transform: `translateY(${20 - introPanelOpacity * 20}px)`,
        }}
      >
        <div style={{ fontSize: 16, color: "#60a5fa", fontWeight: 700, letterSpacing: 0.5 }}>
          THE ARCHITECTURE
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8, lineHeight: 1.2 }}>
          One request touches many systems
        </div>
        <div style={{ fontSize: 16, color: "#cbd5e1", marginTop: 12, lineHeight: 1.5 }}>
          Load balancers, services, caches, event queues, workers, databases, and monitoring all work together. Each layer adds latency and potential failure modes.
        </div>
      </div>

      {/* SVG Connection layer */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        pointerEvents="none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {CONNECTIONS.map((conn, idx) => {
          const fromNode = getNode(conn.from);
          const toNode = getNode(conn.to);
          
          if (!fromNode || !toNode) {
            console.warn(`Connection ${idx} has missing nodes`);
            return null;
          }
          
          const fromCenter = centerOf(fromNode);
          const toCenter = centerOf(toNode);

          const progress = interpolate(
            frame,
            [conn.appearAt, conn.appearAt + 40],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          if (progress <= 0) return null;

          // Draw line up to progress point
          const dx = toCenter.x - fromCenter.x;
          const dy = toCenter.y - fromCenter.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const endX = fromCenter.x + (dx / len) * Math.min(len, len * progress);
          const endY = fromCenter.y + (dy / len) * Math.min(len, len * progress);

          // Connection label
          const labelProgress = interpolate(progress, [0.4, 0.8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={`conn-${idx}`} opacity={progress * 0.9}>
              {/* Main line */}
              <line
                x1={fromCenter.x}
                y1={fromCenter.y}
                x2={endX}
                y2={endY}
                stroke={conn.color}
                strokeWidth={3.5}
                strokeLinecap="round"
                opacity={0.7}
              />

              {/* Animated dot on line */}
              {progress < 1 && (
                <circle
                  cx={endX}
                  cy={endY}
                  r={6}
                  fill={conn.color}
                  filter="url(#glow)"
                />
              )}

              {/* Label */}
              {labelProgress > 0 && (
                <text
                  x={(fromCenter.x + toCenter.x) / 2}
                  y={(fromCenter.y + toCenter.y) / 2 - 12}
                  textAnchor="middle"
                  fill={conn.color}
                  fontSize="14"
                  fontWeight="600"
                  opacity={labelProgress}
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Node blocks */}
      {NODES.map((node) => {
        const nodeAppear = spring({
          fps,
          frame: frame - node.appearAt,
          config: { damping: 13, stiffness: 120 },
        });

        // Pulsing glow for active nodes
        const isActive =
          (node.id === "service1" || node.id === "service2" || node.id === "cache") &&
          frame > 900;
        const glowIntensity = isActive ? (0.4 + pulsePhase * 0.4) : 0.15;

        const scale = interpolate(nodeAppear, [0, 1], [0.6, 1]);
        const opacity = interpolate(nodeAppear, [0, 1], [0, 1]);

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
              width: node.width,
              height: node.height,
              borderRadius: 18,
              border: `2.5px solid ${node.color}`,
              background: `linear-gradient(180deg, ${node.color}18, rgba(15,23,42,0.92))`,
              boxShadow: `0 0 40px ${node.color}${Math.round(
                180 + glowIntensity * 75
              ).toString(16)}, inset 0 1px 2px ${node.color}22`,
              transform: `translateY(${18 - scale * 18}px) scale(${scale})`,
              opacity,
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "all 0.3s ease",
            }}
          >
            {/* Icon badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: `${node.color}20`,
                  border: `1.5px solid ${node.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                {node.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>
                  {node.label}
                </div>
                <div style={{ fontSize: 13, color: "#a0aec0", marginTop: 2 }}>
                  {node.role}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Traffic particles / animated packets */}
      {CONNECTIONS.slice(0, 8).map((conn, idx) => {
        const fromNode = getNode(conn.from);
        const toNode = getNode(conn.to);
        
        if (!fromNode || !toNode) return null;
        
        const trafficProgress = interpolate(
          frame,
          [conn.appearAt + 40, conn.appearAt + 80],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        if (trafficProgress <= 0 || trafficProgress >= 1) return null;

        const pos = packetPosition(conn.from, conn.to, trafficProgress);
        const particleGlow = Math.sin(frame * 0.15 + idx) * 0.5 + 0.5;

        return (
          <div
            key={`traffic-${idx}`}
            style={{
              position: "absolute",
              left: pos.x - 8,
              top: pos.y - 8,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: conn.color,
              boxShadow: `0 0 24px ${conn.color}, 0 0 12px ${conn.color}${Math.round(
                200 + particleGlow * 55
              ).toString(16)}`,
              opacity: 0.85,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Failure scenario - Network partition visualization */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 80,
          width: 420,
          padding: "24px 28px",
          borderRadius: 22,
          background: "linear-gradient(180deg, rgba(127,29,29,0.25), rgba(91,33,182,0.15))",
          border: "2px solid rgba(251,113,133,0.5)",
          boxShadow: "0 20px 40px rgba(244,63,94,0.15)",
          opacity: failureOpacity,
          transform: `translateX(${50 - failureOpacity * 50}px)`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "#fca5a5",
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          ⚠️ Failure Scenario
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: "#fda4af" }}>
          Network Partition
        </div>
        <div style={{ fontSize: 15, color: "#fecdd3", marginTop: 12, lineHeight: 1.6 }}>
          The link between primary and replica fails. Writes continue on primary. Replica reads drift from truth. System is available but <strong>eventually consistent</strong>.
        </div>
      </div>

      {/* Metrics footer */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 40,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
          opacity: metricsOpacity,
        }}
      >
        {METRICS.map((metric, idx) => {
          const metricReveal = interpolate(
            frame,
            [1150 + idx * 15, 1190 + idx * 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={metric.label}
              style={{
                padding: "20px 22px",
                borderRadius: 18,
                background: `${metric.color}12`,
                border: `1.5px solid ${metric.color}44`,
                boxShadow: `0 8px 20px ${metric.color}10`,
                transform: `translateY(${20 - metricReveal * 20}px) scale(${
                  0.92 + metricReveal * 0.08
                })`,
                opacity: metricReveal,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: metric.color,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: metric.color,
                  marginTop: 8,
                }}
              >
                {metric.value}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                {metric.unit}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
    );
  } catch (error) {
    console.error("[DistributedSystemsMap] Error rendering:", error);
    return (
      <AbsoluteFill style={{ background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Error rendering DistributedSystemsMap: {String(error)}</div>
      </AbsoluteFill>
    );
  }
};