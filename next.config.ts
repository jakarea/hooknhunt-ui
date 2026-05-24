import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "192.168.0.166",
      },
      {
        protocol: "https",
        hostname: "hooknhunt-api.test",
      },
      {
        protocol: "https",
        hostname: "probesh.hooknhunt.com",
      },
    ],
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
