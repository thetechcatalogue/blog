import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const SectionScene: React.FC<{
  heading: string;
  body?: string;
}> = ({ heading, body }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingSpring = spring({ fps, frame, config: { damping: 12 } });
  const translateX = interpolate(headingSpring, [0, 1], [-200, 0]);
  const bodyOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          transform: `translateX(${translateX}px)`,
          color: "#6366f1",
          fontSize: 48,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        {heading}
      </div>
      {body && (
        <div
          style={{
            opacity: bodyOpacity,
            color: "#d1d5db",
            fontSize: 28,
            lineHeight: 1.6,
            maxWidth: "80%",
          }}
        >
          {body}
        </div>
      )}
    </AbsoluteFill>
  );
};
