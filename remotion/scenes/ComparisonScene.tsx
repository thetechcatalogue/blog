import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const ComparisonScene: React.FC<{
  heading: string;
  leftLabel: string;
  rightLabel: string;
  leftItems: string[];
  rightItems: string[];
}> = ({ heading, leftLabel, rightLabel, leftItems, rightItems }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingSpring = spring({ fps, frame, config: { damping: 12 } });
  const headingOpacity = interpolate(headingSpring, [0, 1], [0, 1]);

  const leftSlide = interpolate(
    spring({ fps, frame: frame - 10, config: { damping: 14 } }),
    [0, 1],
    [-300, 0]
  );
  const rightSlide = interpolate(
    spring({ fps, frame: frame - 10, config: { damping: 14 } }),
    [0, 1],
    [300, 0]
  );

  const columnStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: "rgba(4, 10, 30, 0.6)",
    border: "1px solid rgba(125, 211, 252, 0.2)",
    borderRadius: 18,
    padding: "32px 36px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  };

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 14% 16%, rgba(34, 211, 238, 0.18), transparent 36%), radial-gradient(circle at 86% 84%, rgba(167, 139, 250, 0.18), transparent 40%), linear-gradient(180deg, #080a16, #0f1324)",
        fontFamily: "Manrope, system-ui, sans-serif",
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        style={{
          opacity: headingOpacity,
          color: "#7dd3fc",
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -1,
          marginBottom: 32,
          textAlign: "center",
          textShadow: "0 8px 30px rgba(56, 189, 248, 0.2)",
        }}
      >
        {heading}
      </div>
      <div style={{ display: "flex", gap: 32, flex: 1 }}>
        {/* Left column */}
        <div style={{ ...columnStyle, transform: `translateX(${leftSlide}px)` }}>
          <div
            style={{
              color: "#22d3ee",
              fontSize: 38,
              fontWeight: 800,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {leftLabel}
          </div>
          {leftItems.map((item, i) => {
            const itemOpacity = interpolate(frame, [25 + i * 12, 35 + i * 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: itemOpacity,
                  color: "#e2ebff",
                  fontSize: 36,
                  lineHeight: 1.3,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#22d3ee",
                    boxShadow: "0 0 14px rgba(34, 211, 238, 0.6)",
                    flexShrink: 0,
                    marginTop: 12,
                  }}
                />
                {item}
              </div>
            );
          })}
        </div>
        {/* Right column */}
        <div style={{ ...columnStyle, transform: `translateX(${rightSlide}px)` }}>
          <div
            style={{
              color: "#a78bfa",
              fontSize: 38,
              fontWeight: 800,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {rightLabel}
          </div>
          {rightItems.map((item, i) => {
            const itemOpacity = interpolate(frame, [25 + i * 12, 35 + i * 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: itemOpacity,
                  color: "#e2ebff",
                  fontSize: 36,
                  lineHeight: 1.3,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#a78bfa",
                    boxShadow: "0 0 14px rgba(167, 139, 250, 0.6)",
                    flexShrink: 0,
                    marginTop: 12,
                  }}
                />
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
