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
  // eslint: {
  //   // Disable ESLint during builds to avoid version conflicts
  //   ignoreDuringBuilds: true,
  // },
  // Remove SQLite packages for Vercel deployment
  // serverExternalPackages: ['sqlite3', 'better-sqlite3'],
  experimental: {
    // Configure API route duration for Vercel
    serverComponentsExternalPackages: []
  }
};

export default nextConfig;
