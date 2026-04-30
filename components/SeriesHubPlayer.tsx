"use client";

import { useState, useMemo } from "react";
import { Player } from "@remotion/player";
import { buildSeriesEpisodeCatalog } from "@/remotion/seriesCatalogBuilder";
import type { SeriesContent } from "@/remotion/seriesContentTypes";

type Props = {
  series: SeriesContent;
  initialEpisodeIndex?: number;
};

const CONTENT_TYPE_BADGE: Record<string, string> = {
  markdown: "📝 Animated",
  flow:     "🔄 Flow",
  composition: "🎬 Video",
};

export const SeriesHubPlayer: React.FC<Props> = ({
  series,
  initialEpisodeIndex = 0,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(
    Math.min(initialEpisodeIndex, series.episodes.length - 1)
  );

  const episodeCatalog = useMemo(
    () => buildSeriesEpisodeCatalog(series),
    [series]
  );

  const current = episodeCatalog[selectedIdx] ?? episodeCatalog[0];

  if (!current) {
    return (
      <p className="text-zinc-600 dark:text-zinc-500 text-sm">
        No episodes found in this series.
      </p>
    );
  }

  return (
    <div className="w-full max-w-6xl flex gap-6">
      {/* ── Episode sidebar ──────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 flex flex-col gap-1">
        <p className="text-zinc-600 dark:text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-2 px-2">
          Episodes ({series.episodes.length})
        </p>
        {series.episodes.map((ep, i) => {
          const isActive = i === selectedIdx;
          return (
            <button
              key={ep.id}
              onClick={() => setSelectedIdx(i)}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2.5 group ${
                isActive
                  ? "bg-indigo-100 text-indigo-950 ring-1 ring-indigo-200 dark:bg-indigo-600 dark:text-white dark:ring-0"
                  : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {/* Episode number bubble */}
              <span
                className={`mt-0.5 shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                  isActive
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-400 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-600"
                }`}
              >
                {i + 1}
              </span>

              {/* Title + meta */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium leading-snug line-clamp-2">
                  {ep.title}
                </span>
                {ep.description && (
                  <span
                    className={`text-xs truncate mt-0.5 ${
                      isActive
                        ? "text-indigo-800/80 dark:text-indigo-100/80"
                        : "text-zinc-500 dark:text-zinc-500"
                    }`}
                  >
                    {ep.description}
                  </span>
                )}
                <span
                  className={`text-xs mt-1 ${
                    isActive
                      ? "text-indigo-800/80 dark:text-indigo-100/80"
                      : "text-zinc-500 dark:text-zinc-600"
                  }`}
                >
                  {CONTENT_TYPE_BADGE[ep.contentType] ?? ep.contentType}
                </span>
              </div>
            </button>
          );
        })}
      </aside>

      {/* ── Player ───────────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <Player
          key={current.id}
          component={current.component}
          inputProps={current.inputProps ?? {}}
          compositionWidth={current.compositionWidth}
          compositionHeight={current.compositionHeight}
          durationInFrames={current.durationInFrames}
          fps={current.fps}
          style={{
            width: "100%",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 18px 40px -16px rgba(0, 0, 0, 0.25)",
          }}
          controls
          loop
          acknowledgeRemotionLicense
        />

        {/* Current episode meta */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-zinc-900 dark:text-white font-semibold text-lg">{current.label}</h2>
            {current.description && (
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-0.5">{current.description}</p>
            )}
          </div>
          {/* Prev / Next controls */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setSelectedIdx((i) => Math.max(0, i - 1))}
              disabled={selectedIdx === 0}
              className="px-4 py-1.5 rounded-lg bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 text-sm disabled:opacity-30 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() =>
                setSelectedIdx((i) =>
                  Math.min(series.episodes.length - 1, i + 1)
                )
              }
              disabled={selectedIdx === series.episodes.length - 1}
              className="px-4 py-1.5 rounded-lg bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 text-sm disabled:opacity-30 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
