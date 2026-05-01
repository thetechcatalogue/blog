"use client";

import { MarkdownVideo } from "@/remotion/MarkdownVideo";
import { ClientServerFlow } from "@/remotion/diagrams/ClientServerFlow";
import { FLOW_REGISTRY } from "@/remotion/diagrams/flowRegistry";
import { buildVideoCatalog, type VideoDefinition } from "@/remotion/videoCatalog";
import type { SeriesContent } from "@/remotion/seriesContentTypes";

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
      fps: 30,
      compositionWidth: 1920 as const,
      compositionHeight: 1080 as const,
    };

    // ── markdown ───────────────────────────────────────────────────────────
    if (episode.contentType === "markdown" && episode.scenes) {
      return {
        ...base,
        component: MarkdownVideo as React.ComponentType<Record<string, unknown>>,
        inputProps: { scenes: episode.scenes },
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

    // ── composition ────────────────────────────────────────────────────────
    if (episode.contentType === "composition" && episode.compositionId) {
      const existing = staticCatalog.find(
        (v) => v.id === episode.compositionId
      );
      if (existing) {
        return { ...existing, id, label: episode.title };
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
