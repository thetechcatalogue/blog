import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const QuoteScene: React.FC<{
  heading: string;
  body: string;
  attribution?: string;
}> = ({ heading, body, attribution }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteSpring = spring({ fps, frame, config: { damping: 14 } });
  const quoteScale = interpolate(quoteSpring, [0, 1], [0.9, 1]);
  const quoteOpacity = interpolate(quoteSpring, [0, 1], [0, 1]);

  const attrOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 30%, rgba(167, 139, 250, 0.22), transparent 50%), radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.15), transparent 40%), linear-gradient(180deg, #080a16, #0f1324)",
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
          color: "#a78bfa",
          fontSize: 140,
          fontWeight: 800,
          lineHeight: 0.6,
          opacity: 0.35,
          marginBottom: -20,
          fontFamily: "Georgia, serif",
        }}
      >
        &ldquo;
      </div>
      <div
        style={{
          opacity: quoteOpacity,
          transform: `scale(${quoteScale})`,
          color: "#f0f4ff",
          fontSize: 48,
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.4,
          maxWidth: "90%",
          fontStyle: "italic",
        }}
      >
        {body}
      </div>
      {attribution && (
        <div
          style={{
            opacity: attrOpacity,
            color: "#7dd3fc",
            fontSize: 40,
            marginTop: 36,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          — {attribution}
        </div>
      )}
      {heading && heading !== body && (
        <div
          style={{
            opacity: attrOpacity,
            color: "#94a3b8",
            fontSize: 34,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          {heading}
        </div>
      )}
    </AbsoluteFill>
  );
};
