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
        backgroundColor: "#0f0f1a",
        justifyContent: "center",
        padding: "0 120px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          transform: `scale(${headingScale})`,
          color: "#6366f1",
          fontSize: 44,
          fontWeight: 700,
          marginBottom: body ? 16 : 36,
        }}
      >
        {heading}
      </div>
      {body && (
        <div
          style={{
            color: "#9ca3af",
            fontSize: 24,
            marginBottom: 30,
          }}
        >
          {body}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#6366f1",
                  flexShrink: 0,
                }}
              />
              <div style={{ color: "#e2e8f0", fontSize: 28 }}>{item}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
