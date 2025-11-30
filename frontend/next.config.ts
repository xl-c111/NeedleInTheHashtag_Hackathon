import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "village.app",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    minimumCacheTTL: 2_678_400,
  },
  reactStrictMode: true,
  cacheComponents: false,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
