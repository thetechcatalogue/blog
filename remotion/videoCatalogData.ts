import { cache } from "react";
import { loadMarkdownVideosFromFolder } from "@/remotion/videoContentLoader";

export const getMarkdownVideoContentData = cache(async () => {
  return loadMarkdownVideosFromFolder();
});
