import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider, themeScript } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechCatalogue",
  description: "Notes, guides, and reference material for software engineers.",
  metadataBase: new URL("https://thetechcatalogue.github.io"),
  openGraph: {
    title: "TechCatalogue",
    description: "Notes, guides, and reference material for software engineers.",
    siteName: "TechCatalogue",
    images: [{ url: "/og/site/default.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechCatalogue",
    description: "Notes, guides, and reference material for software engineers.",
    images: ["/og/site/default.png"],
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
      "application/atom+xml": "/atom.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`} suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
