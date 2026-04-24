/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Static export for GitHub Pages
    output: 'export',
    // Disable server-side image optimization (not available in static export)
    images: { unoptimized: true },
    // Allow .md and .mdx file extensions for pages
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

export default nextConfig;
