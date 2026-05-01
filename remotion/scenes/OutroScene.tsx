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
        background:
          "radial-gradient(circle at 20% 18%, rgba(34, 211, 238, 0.16), transparent 42%), radial-gradient(circle at 80% 24%, rgba(167, 139, 250, 0.18), transparent 44%), linear-gradient(180deg, #080a16, #0f1324)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Manrope, system-ui, sans-serif",
        padding: "0 100px",
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
          transform: `scale(${scale})`,
          opacity: fadeOut,
          color: "#f4f8ff",
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -1,
          lineHeight: 1.08,
          textAlign: "center",
          maxWidth: "90%",
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
          color: "#67e8f9",
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: 0.2,
          marginTop: 26,
          textAlign: "center",
        }}
      >
        Techcatalogue - Your Ultimate Tech Resource
      </div>
    </AbsoluteFill>
  );
};
