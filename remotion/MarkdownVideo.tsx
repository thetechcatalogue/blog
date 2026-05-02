import { Audio, Series } from "remotion";
import { Scene } from "./types";
import { SceneRenderer } from "./SceneRenderer";

export const MarkdownVideo: React.FC<{
  scenes: Scene[];
  narrationSrc?: string;
  narrationVolume?: number;
}> = ({ scenes, narrationSrc, narrationVolume = 0.9 }) => {
  return (
    <>
      {narrationSrc ? <Audio src={narrationSrc} volume={narrationVolume} /> : null}
      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence key={i} durationInFrames={scene.duration}>
            <SceneRenderer scene={scene} />
          </Series.Sequence>
        ))}
      </Series>
    </>
  );
};
