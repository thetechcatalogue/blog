"use client";

import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Player } from "@remotion/player";
import { buildVideoCatalog } from "@/remotion/videoCatalog";
import type { MarkdownVideoContent, VideoCategory } from "@/remotion/videoContentTypes";

const CATEGORY_OPTIONS: { value: VideoCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI / LLM" },
  { value: "engineering", label: "Engineering" },
  { value: "diagrams", label: "Diagrams" },
];

type VideoHubSidebarPlayerProps = {
  markdownVideos: MarkdownVideoContent[];
  initialVideoId?: string;
};

export const VideoHubSidebarPlayer: React.FC<VideoHubSidebarPlayerProps> = ({
  markdownVideos,
  initialVideoId,
}) => {
  const searchParams = useSearchParams();

  const videoCatalog = useMemo(
    () => buildVideoCatalog({ markdownVideos }),
    [markdownVideos]
  );

  const categoryParam = (searchParams.get("category") as VideoCategory | "all") || "all";
  const [activeCategory, setActiveCategory] = useState<VideoCategory | "all">(
    CATEGORY_OPTIONS.some((o) => o.value === categoryParam) ? categoryParam : "all"
  );

  const filteredCatalog = useMemo(() => {
    if (activeCategory === "all") return videoCatalog;
    return videoCatalog.filter((v) => v.category === activeCategory);
  }, [videoCatalog, activeCategory]);

  const videoParam = searchParams.get("v");
  const safeInitialId =
    (videoParam && videoCatalog.some((v) => v.id === videoParam) ? videoParam : null) ||
    (initialVideoId && videoCatalog.some((v) => v.id === initialVideoId) ? initialVideoId : null) ||
    filteredCatalog[0]?.id;

  const [selectedId, setSelectedId] = useState<string>(safeInitialId || "");

  const updateUrl = useCallback(
    (videoId: string, category: VideoCategory | "all") => {
      const params = new URLSearchParams();
      params.set("v", videoId);
      if (category !== "all") params.set("category", category);
      window.history.replaceState(null, "", `?${params.toString()}`);
    },
    []
  );

  const handleSelectVideo = useCallback(
    (id: string) => {
      setSelectedId(id);
      updateUrl(id, activeCategory);
    },
    [activeCategory, updateUrl]
  );

  const handleCategoryChange = useCallback(
    (cat: VideoCategory | "all") => {
      setActiveCategory(cat);
      const filtered =
        cat === "all" ? videoCatalog : videoCatalog.filter((v) => v.category === cat);
      if (filtered.length > 0 && !filtered.some((v) => v.id === selectedId)) {
        setSelectedId(filtered[0].id);
        updateUrl(filtered[0].id, cat);
      } else {
        updateUrl(selectedId, cat);
      }
    },
    [videoCatalog, selectedId, updateUrl]
  );

  const selectedVideo = useMemo(() => {
    return (
      videoCatalog.find((video) => video.id === selectedId) ??
      filteredCatalog[0]
    );
  }, [selectedId, videoCatalog, filteredCatalog]);

  if (!selectedVideo) {
    return (
      <p className="text-zinc-600 dark:text-zinc-500 text-sm">
        No videos found.
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* ── Video sidebar ──────────────────────────────────────────────── */}
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-1">
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-1.5 mb-3 px-1">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleCategoryChange(opt.value)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeCategory === opt.value
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-zinc-600 dark:text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-2 px-2">
          Videos ({filteredCatalog.length})
        </p>
        {filteredCatalog.map((video, i) => {
          const isActive = video.id === selectedVideo.id;
          return (
            <button
              key={video.id}
              onClick={() => handleSelectVideo(video.id)}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 flex items-start gap-2.5 group ${
                isActive
                  ? "bg-indigo-100 text-indigo-950 ring-1 ring-indigo-200 dark:bg-indigo-600 dark:text-white dark:ring-0"
                  : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {/* Video number bubble */}
              <span
                className={`mt-0.5 shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                  isActive
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-400 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-600"
                }`}
              >
                {i + 1}
              </span>

              {/* Title + description */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium leading-snug line-clamp-2">
                  {video.label}
                </span>
                {video.description && (
                  <span
                    className={`text-xs truncate mt-0.5 ${
                      isActive
                        ? "text-indigo-700 dark:text-indigo-200"
                        : "text-zinc-600 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-400"
                    }`}
                  >
                    {video.description}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </aside>

      {/* ── Player section ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {selectedVideo.label}
          </h3>
          {selectedVideo.description && (
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
              {selectedVideo.description}
            </p>
          )}
        </div>

        <Player
          component={selectedVideo.component}
          durationInFrames={selectedVideo.durationInFrames}
          compositionHeight={selectedVideo.compositionHeight}
          compositionWidth={selectedVideo.compositionWidth}
          fps={selectedVideo.fps}
          controls
          inputProps={selectedVideo.inputProps}
          style={{
            width: "100%",
            maxWidth: 960,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 18px 40px -16px rgba(0, 0, 0, 0.25)",
          }}
          allowFullscreen
          acknowledgeRemotionLicense
        />
      </div>
    </div>
  );
};
