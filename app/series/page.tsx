import Link from "next/link";
import { getSeriesData } from "@/remotion/seriesCatalogData";

export default async function SeriesIndexPage() {
  const allSeries = await getSeriesData();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-black flex flex-col items-center p-8">
      <nav className="w-full max-w-4xl mb-8">
        <Link
          href="/"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors text-sm"
        >
          ← Home
        </Link>
      </nav>

      <header className="w-full max-w-4xl mb-10 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">📚 Video Series</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Welcome to learning series from Tech Catalogue in{" "}
          {/* <code className="bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-1.5 py-0.5 rounded text-xs">
            src/content/series/
          </code>{" "}
          to add a new series. */}
        </p>
      </header>

      {allSeries.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          No series found. Add a folder to{" "}
          <code className="bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 px-1 rounded">
            src/content/series/
          </code>
          .
        </p>
      )}

      <div className="w-full max-w-4xl grid grid-cols-1 gap-4">
        {allSeries.map((series) => (
          <Link
            key={series.id}
            href={`/series/${series.slug}`}
            className="flex items-start gap-5 bg-white/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-2xl p-6 transition-colors group"
          >
            <span className="text-5xl leading-none">{series.icon}</span>
            <div className="flex flex-col min-w-0">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {series.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1 line-clamp-2">
                {series.description}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-zinc-600 dark:text-zinc-500">
                  {series.episodes.length} episode
                  {series.episodes.length !== 1 ? "s" : ""}
                </span>
                <span className="text-zinc-500 dark:text-zinc-700">·</span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 group-hover:underline">
                  Watch series →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
