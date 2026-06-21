import { Sequence, staticFile } from "remotion";
import { buildSeriesEpisodeCatalog } from "./seriesCatalogBuilder";
import { MarkdownVideo } from "./MarkdownVideo";
import type { SeriesContent } from "./seriesContentTypes";

type Props = {
  series: SeriesContent;
};

export const SeriesCompilation: React.FC<Props> = ({ series }) => {
  const episodes = buildSeriesEpisodeCatalog(series).map((episode) => {
    const narrationSrc = episode.inputProps?.narrationSrc;

    // MarkdownVideo resolves narrationSrc via staticFile() internally — skip pre-resolution
    // to avoid double-call which produces "public/audio/..." paths that Remotion rejects.
    if (episode.component === (MarkdownVideo as React.ComponentType<Record<string, unknown>>)) {
      return episode;
    }

    if (typeof narrationSrc !== "string" || !narrationSrc.startsWith("/")) {
      return episode;
    }

    return {
      ...episode,
      inputProps: {
        ...episode.inputProps,
        narrationSrc: staticFile(narrationSrc.replace(/^\//, "")),
      },
    };
  });
  let startFrame = 0;

  return (
    <>
      {episodes.map((episode) => {
        const EpisodeComponent = episode.component;
        const sequence = (
          <Sequence
            key={episode.id}
            from={startFrame}
            durationInFrames={episode.durationInFrames}
          >
            <EpisodeComponent {...(episode.inputProps ?? {})} />
          </Sequence>
        );

        startFrame += episode.durationInFrames;
        return sequence;
      })}
    </>
  );
};