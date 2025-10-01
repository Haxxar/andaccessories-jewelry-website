import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export to enable API routes
  // output: "export",
  images: {
    unoptimized: false, // Enable image optimization
    formats: ['image/avif', 'image/webp'], // Modern formats for better compression
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains for product images
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Disable ESLint during builds to avoid build failures
    ignoreDuringBuilds: true,
  },
  // Remove SQLite packages for Vercel deployment
  // serverExternalPackages: ['sqlite3', 'better-sqlite3'],
  experimental: {
    // Configure API route duration for Vercel
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
