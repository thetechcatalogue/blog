import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const ListScene: React.FC<{
  heading: string;
  body?: string;
  items: string[];
}> = ({ heading, body, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingSpring = spring({ fps, frame, config: { damping: 12 } });
  const headingScale = interpolate(headingSpring, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 14%, rgba(34, 211, 238, 0.18), transparent 38%), radial-gradient(circle at 84% 24%, rgba(167, 139, 250, 0.18), transparent 40%), linear-gradient(180deg, #080a16, #0f1324)",
        justifyContent: "flex-start",
        padding: "60px 80px",
        fontFamily: "Manrope, system-ui, sans-serif",
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
          transform: `scale(${headingScale})`,
          color: "#7dd3fc",
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -1,
          lineHeight: 1.1,
          marginBottom: body ? 18 : 30,
          maxWidth: "100%",
        }}
      >
        {heading}
      </div>
      {body && (
        <div
          style={{
            color: "#d6e1f7",
            fontSize: 44,
            lineHeight: 1.34,
            marginBottom: 28,
            maxWidth: "100%",
          }}
        >
          {body}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "100%" }}>
        {items.map((item, i) => {
          const itemSpring = spring({
            fps,
            frame: frame - 20 - i * 20,
            config: { damping: 12 },
          });
          const opacity = interpolate(itemSpring, [0, 1], [0, 1]);
          const translateY = interpolate(itemSpring, [0, 1], [30, 0]);

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                display: "flex",
                alignItems: "flex-start",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#22d3ee",
                  boxShadow: "0 0 18px rgba(34, 211, 238, 0.65)",
                  flexShrink: 0,
                  marginTop: 14,
                }}
              />
              <div style={{ color: "#e2ebff", fontSize: 44, lineHeight: 1.28 }}>{item}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
