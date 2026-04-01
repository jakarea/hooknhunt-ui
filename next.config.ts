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
    ],
  },
};

export default nextConfig;
