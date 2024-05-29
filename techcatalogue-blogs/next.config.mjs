/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    rewrites: async () => [
      {
        source: "/blogs",
        destination: "/blogs/index.html",
      },
    ],
    
};

export default nextConfig;
