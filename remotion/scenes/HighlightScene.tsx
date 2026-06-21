import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const HighlightScene: React.FC<{
  heading: string;
  items: string[];
}> = ({ heading, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ fps, frame, config: { damping: 12 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.24), transparent 50%), radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.14), transparent 40%), linear-gradient(180deg, #080a16, #0f1324)",
        justifyContent: "center",
        alignItems: "center",
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
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          backgroundColor: "rgba(4, 10, 30, 0.65)",
          border: "2px solid rgba(167, 139, 250, 0.4)",
          borderRadius: 24,
          boxShadow:
            "0 0 60px rgba(167, 139, 250, 0.15), 0 24px 60px rgba(2, 6, 23, 0.45)",
          padding: "48px 56px",
          maxWidth: "92%",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Icon + heading */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              flexShrink: 0,
            }}
          >
            💡
          </div>
          <div
            style={{
              color: "#f0f4ff",
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1.15,
            }}
          >
            {heading}
          </div>
        </div>
        {/* Items */}
        {items.map((item, i) => {
          const itemOpacity = interpolate(frame, [20 + i * 14, 32 + i * 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                color: "#d6e1f7",
                fontSize: 42,
                lineHeight: 1.35,
                paddingLeft: 72,
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  color: "#a78bfa",
                  fontSize: 42,
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                ›
              </div>
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
