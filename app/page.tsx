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
        <h1
          className="mb-4 text-5xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          TechCatalogue
        </h1>
        <p
          className="mx-auto max-w-2xl text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          Notes, guides, and reference material covering system design, interviews,
          AI/ML, and software engineering fundamentals.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="card-themed group rounded-xl border p-6 transition-all hover:shadow-lg"
          >
            <h2 className="card-title mb-2 text-lg font-semibold">
              {section.title}
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </h2>
            <p className="card-desc text-sm">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
