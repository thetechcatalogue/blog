import Link from "next/link";

const footerSections = [
  {
    title: "Docs",
    links: [
      { label: "Interview Prep", href: "/docs/interview/overview" },
      { label: "System Design", href: "/docs/system-design/intro" },
      { label: "AI & Machine Learning", href: "/docs/ai-machine-learning/famous-data-mining-algos" },
      { label: "Recommended Reading", href: "/docs/all-books-we-know" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "https://discordapp.com/invite/techcatalogue", external: true },
      { label: "Instagram", href: "https://www.instagram.com/techcatalogue.in", external: true },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "GitHub", href: "https://github.com/thetechcatalogue", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 text-center dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Copyright &copy; {new Date().getFullYear()} TechCatalogue. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
