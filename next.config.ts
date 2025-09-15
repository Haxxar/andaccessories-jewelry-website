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
  // Remove SQLite packages for Vercel deployment
  // serverExternalPackages: ['sqlite3', 'better-sqlite3'],
  experimental: {
    serverComponentsExternalPackages: []
  }
};

export default nextConfig;
