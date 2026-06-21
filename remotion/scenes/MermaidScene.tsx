import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

export const MermaidScene: React.FC<{
  heading: string;
  body?: string;
  chart: string;
}> = ({ heading, body, chart }) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const id = `remotion-mermaid-${Math.random().toString(36).slice(2, 9)}`;
    mermaid.render(id, chart).then(({ svg }) => {
      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  const contentOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 16% 16%, rgba(16, 185, 129, 0.18), transparent 34%), radial-gradient(circle at 84% 18%, rgba(59, 130, 246, 0.18), transparent 36%), linear-gradient(180deg, #08121a, #0b1624)",
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
            "linear-gradient(rgba(148,163,184,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        style={{
          color: "#7dd3fc",
          fontSize: 58,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: body ? 14 : 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        {heading}
      </div>
      {body ? (
        <div
          style={{
            color: "#dbe7fb",
            fontSize: 36,
            lineHeight: 1.32,
            marginBottom: 22,
            maxWidth: "92%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {body}
        </div>
      ) : null}
      <div
        style={{
          opacity: contentOpacity,
          flex: 1,
          borderRadius: 28,
          border: "1px solid rgba(125, 211, 252, 0.22)",
          background: "rgba(255,255,255,0.96)",
          padding: 28,
          boxShadow: "0 28px 70px rgba(2, 6, 23, 0.38)",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          ref={ref}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};