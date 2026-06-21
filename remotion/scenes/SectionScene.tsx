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
        background:
          "radial-gradient(circle at 16% 18%, rgba(34, 211, 238, 0.17), transparent 36%), radial-gradient(circle at 86% 84%, rgba(167, 139, 250, 0.16), transparent 40%), linear-gradient(180deg, #080a16, #0f1324)",
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
          transform: `translateX(${translateX}px)`,
          color: "#7dd3fc",
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -1,
          lineHeight: 1.1,
          marginBottom: 26,
          maxWidth: "100%",
          textShadow: "0 8px 30px rgba(56, 189, 248, 0.2)",
        }}
      >
        {heading}
      </div>
      {body && (
        <div
          style={{
            opacity: bodyOpacity,
            color: "#d6e1f7",
            fontSize: 46,
            lineHeight: 1.35,
            maxWidth: "100%",
          }}
        >
          {body}
        </div>
      )}
    </AbsoluteFill>
  );
};
