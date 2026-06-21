"use client";

import { MarkdownVideo } from "./MarkdownVideo";
import { DiagramVideo } from "./DiagramVideo";
import { ClientServerFlow } from "./diagrams/ClientServerFlow";
import { FLOW_REGISTRY } from "./diagrams/flowRegistry";
import { buildVideoCatalog, type VideoDefinition } from "./videoCatalog";
import type { SeriesContent } from "./seriesContentTypes";

/**
 * Client-side builder that turns a series's episodes into VideoDefinitions.
 *
 * Three content types are supported:
 *   markdown    — MarkdownVideo component, scenes from md file
 *   flow        — ClientServerFlow component, config from FLOW_REGISTRY
 *   composition — Reuses an existing static VideoDefinition by compositionId
 *
 * New content type? Add a handler in the map below and extend EpisodeContentType.
 */
export function buildSeriesEpisodeCatalog(
  series: SeriesContent
): VideoDefinition[] {
  // Only needed for "composition" lookups — no markdown videos required
  const staticCatalog = buildVideoCatalog();

  return series.episodes.map((episode): VideoDefinition => {
    const id = `${series.slug}--${episode.slug}`;
    const base = {
      id,
      label: episode.title,
      description: episode.description ?? "",
      accentClass: series.accentClass,
      category: "ai" as const,
      fps: 30,
      compositionWidth: 1920 as const,
      compositionHeight: 1080 as const,
    };

    // ── markdown ───────────────────────────────────────────────────────────
    if (episode.contentType === "markdown" && episode.scenes) {
      return {
        ...base,
        component: MarkdownVideo as React.ComponentType<Record<string, unknown>>,
        inputProps: {
          scenes: episode.scenes,
          narrationSrc: episode.narrationSrc,
        },
        durationInFrames: Math.max(
          90,
          episode.scenes.reduce((s, sc) => s + sc.duration, 0)
        ),
      };
    }

    // ── flow ───────────────────────────────────────────────────────────────
    if (episode.contentType === "flow" && episode.flowId) {
      const flowConfig = FLOW_REGISTRY[episode.flowId];
      if (flowConfig) {
        return {
          ...base,
          component:
            ClientServerFlow as React.ComponentType<Record<string, unknown>>,
          inputProps: { config: flowConfig },
          durationInFrames: 60 + flowConfig.steps.length * 60,
        };
      }
    }

    // ── diagram ────────────────────────────────────────────────────────────
    if (episode.contentType === "diagram" && episode.diagramId) {
      const durationInFrames = Math.max(
        150,
        episode.audioDurationSec ? Math.round(episode.audioDurationSec * 30) : 450
      );
      return {
        ...base,
        component: DiagramVideo as React.ComponentType<Record<string, unknown>>,
        inputProps: {
          diagramId: episode.diagramId,
          narrationSrc: episode.narrationSrc,
        },
        durationInFrames,
      };
    }

    // ── composition ────────────────────────────────────────────────────────
    if (episode.contentType === "composition" && episode.compositionId) {
      const existing = staticCatalog.find(
        (v) => v.id === episode.compositionId
      );
      if (existing) {
        const narrationOverride = episode.narrationSrc
          ? { narrationSrc: episode.narrationSrc }
          : {};
        const durationInFrames = episode.audioDurationSec
          ? Math.max(existing.durationInFrames, Math.round(episode.audioDurationSec * existing.fps))
          : existing.durationInFrames;
        return {
          ...existing,
          id,
          label: episode.title,
          durationInFrames,
          inputProps: { ...existing.inputProps, ...narrationOverride },
        };
      }
    }

    // ── fallback: empty placeholder ────────────────────────────────────────
    return {
      ...base,
      component: MarkdownVideo as React.ComponentType<Record<string, unknown>>,
      inputProps: { scenes: [] },
      durationInFrames: 150,
    };
  });
}
