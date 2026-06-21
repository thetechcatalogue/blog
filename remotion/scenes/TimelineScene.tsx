import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TimelineScene: React.FC<{
  heading: string;
  items: string[];
}> = ({ heading, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingSpring = spring({ fps, frame, config: { damping: 12 } });
  const headingOpacity = interpolate(headingSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 10%, rgba(34, 211, 238, 0.2), transparent 40%), radial-gradient(circle at 80% 90%, rgba(167, 139, 250, 0.16), transparent 40%), linear-gradient(180deg, #080a16, #0f1324)",
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
          marginBottom: 40,
          textAlign: "center",
          textShadow: "0 8px 30px rgba(56, 189, 248, 0.2)",
        }}
      >
        {heading}
      </div>
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: "rgba(34, 211, 238, 0.3)",
            borderRadius: 2,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {items.map((item, i) => {
            const itemSpring = spring({
              fps,
              frame: frame - 15 - i * 18,
              config: { damping: 12 },
            });
            const opacity = interpolate(itemSpring, [0, 1], [0, 1]);
            const translateX = interpolate(itemSpring, [0, 1], [60, 0]);

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `translateX(${translateX}px)`,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                  paddingLeft: 8,
                }}
              >
                {/* Node */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "#080a16",
                    border: "3px solid #22d3ee",
                    boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#22d3ee",
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    color: "#e2ebff",
                    fontSize: 42,
                    lineHeight: 1.3,
                    paddingTop: 4,
                  }}
                >
                  {item}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
