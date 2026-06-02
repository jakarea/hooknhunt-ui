import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Next.js Image optimization for best performance
  images: {
    // Enable image optimization (WebP, AVIF, resizing, lazy loading)
    unoptimized: false,

    // Allow optimized images from backend domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hooknhunt-api.test",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "probesh.hooknhunt.com",
        pathname: "/storage/**",
      },
      // Development only
      {
        protocol: "http",
        hostname: "192.168.0.166",
        pathname: "/storage/**",
      },
      // Unsplash (for demo/placeholder images)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],

    // Image sizes for optimization (pre-generate these sizes)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Format preference (modern formats for better performance)
    formats: ['image/avif', 'image/webp'],

    // Minimum cache TTL (1 hour) for performance
    minimumCacheTTL: 3600,
  },
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v2', '') || 'https://hooknhunt-api.test';

    return [
      {
        source: '/api/v2/:path*',
        destination: `${apiBaseUrl}/api/v2/:path*`,
      },
    ];
  },
};

export default nextConfig;
