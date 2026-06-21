import { Audio, AbsoluteFill } from "remotion";
import { DIAGRAM_REGISTRY } from "./diagrams/diagramRegistry";

export const DiagramVideo: React.FC<{
  diagramId: string;
  narrationSrc?: string;
  narrationVolume?: number;
}> = ({ diagramId, narrationSrc, narrationVolume = 0.9 }) => {
  const DiagramComponent = DIAGRAM_REGISTRY[diagramId];

  if (!DiagramComponent) {
    return (
      <AbsoluteFill style={{
        background: "#0f172a",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#ef4444", fontSize: 28, fontFamily: "sans-serif",
      }}>
        Unknown diagramId: {diagramId}
      </AbsoluteFill>
    );
  }

  return (
    <>
      {narrationSrc ? <Audio src={narrationSrc} volume={narrationVolume} /> : null}
      <DiagramComponent />
    </>
  );
};
