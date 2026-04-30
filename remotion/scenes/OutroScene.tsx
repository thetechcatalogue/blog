import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const OutroScene: React.FC<{
  heading: string;
}> = ({ heading }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ fps, frame, config: { damping: 12 } });
  const fadeOut = interpolate(frame, [50, 70], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f0f1a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: fadeOut,
          color: "#ffffff",
          fontSize: 56,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {heading}
      </div>
      <div
        style={{
          opacity: fadeOut * interpolate(frame, [15, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          color: "#6366f1",
          fontSize: 24,
          marginTop: 20,
        }}
      >
        Built with Remotion + Next.js
      </div>
    </AbsoluteFill>
  );
};
