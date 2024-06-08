/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    rewrites: async () => [
      {
        source: "/blogs",
        destination: "/blogs/index.html",
      },
      {
        source: "/blogs/:path*",
        destination: "/blogs/:path*/index.html",
      },
    ],
    
};

export default nextConfig;
