import { cache } from "react";
import { loadSeriesFromFolder } from "./seriesContentLoader";
import type { SeriesContent } from "./seriesContentTypes";

/**
 * Server-side cached series data.
 * Called from Server Components only — safe because it uses node:fs.
 */
export const getSeriesData = cache(async (): Promise<SeriesContent[]> => {
  return loadSeriesFromFolder();
});
