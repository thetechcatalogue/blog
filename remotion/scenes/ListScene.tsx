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
        justifyContent: "center",
        padding: "0 96px",
        fontFamily: "Manrope, system-ui, sans-serif",
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
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: -1,
          lineHeight: 1.05,
          marginBottom: body ? 16 : 36,
          maxWidth: "92%",
        }}
      >
        {heading}
      </div>
      {body && (
        <div
          style={{
            color: "#d6e1f7",
            fontSize: 40,
            lineHeight: 1.4,
            marginBottom: 32,
            maxWidth: "90%",
          }}
        >
          {body}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: "92%" }}>
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
                alignItems: "center",
                gap: 16,
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
                }}
              />
              <div style={{ color: "#e2ebff", fontSize: 42, lineHeight: 1.3 }}>{item}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
