import Link from "next/link";
import { notFound } from "next/navigation";
import { SeriesHubPlayer } from "@/components/SeriesHubPlayer";
import { getSeriesData } from "@/remotion/seriesCatalogData";

type Props = {
  params: Promise<{ seriesSlug: string }>;
};

export async function generateStaticParams() {
  const allSeries = await getSeriesData();
  return allSeries.map((series) => ({ seriesSlug: series.slug }));
}

export default async function SeriesPage({ params }: Props) {
  const [{ seriesSlug }, allSeries] = await Promise.all([
    params,
    getSeriesData(),
  ]);

  const series = allSeries.find((s) => s.slug === seriesSlug);
  if (!series) notFound();

  const initialEpisodeIndex = 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-black flex flex-col items-center p-4 sm:p-8">
      {/* Breadcrumb nav */}
      <nav className="w-full max-w-6xl mb-4 sm:mb-8 flex items-center gap-2 text-sm flex-wrap">
        <Link
          href="/"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
        >
          Home
        </Link>
        <span className="text-zinc-500 dark:text-zinc-700">/</span>
        <Link
          href="/series"
          className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
        >
          Series
        </Link>
        <span className="text-zinc-500 dark:text-zinc-700">/</span>
        <span className="text-zinc-700 dark:text-zinc-400 truncate max-w-[160px] sm:max-w-none">{series.title}</span>
      </nav>

      {/* Series header */}
      <header className="w-full max-w-6xl mb-4 sm:mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl sm:text-4xl">{series.icon}</span>
          <h1 className="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white leading-tight">{series.title}</h1>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1 text-sm sm:text-base">{series.description}</p>
        <p className="text-zinc-600 dark:text-zinc-500 text-xs sm:text-sm mt-1">
          {series.episodes.length} episode
          {series.episodes.length !== 1 ? "s" : ""}
        </p>
      </header>

      {/* Player + episode sidebar */}
      <SeriesHubPlayer series={series} initialEpisodeIndex={initialEpisodeIndex} />
    </div>
  );
}
