import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export to enable API routes
  // output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sqlite3', 'better-sqlite3']
};

export default nextConfig;
