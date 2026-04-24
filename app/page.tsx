import Link from "next/link";

const sections = [
  {
    title: "System Design",
    description: "Architecture patterns, interview strategies, and popular design questions.",
    href: "/docs/system-design/intro",
  },
  {
    title: "Interview Prep",
    description: "SDL, authorization flows, HTTPS handshakes, and storytelling tips.",
    href: "/docs/interview/overview",
  },
  {
    title: "AI & Machine Learning",
    description: "Famous data mining algorithms — from decision trees to PageRank.",
    href: "/docs/ai-machine-learning/famous-data-mining-algos",
  },
  {
    title: "Blog",
    description: "Articles on networking, Azure, cloud architecture, and more.",
    href: "/blog",
  },
  {
    title: "Recommended Reading",
    description: "Curated books every software engineer should read.",
    href: "/docs/all-books-we-know",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          TechCatalogue
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          Notes, guides, and reference material covering system design, interviews,
          AI/ML, and software engineering fundamentals.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-xl border border-gray-200 p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:hover:border-blue-800"
          >
            <h2 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {section.title}
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
