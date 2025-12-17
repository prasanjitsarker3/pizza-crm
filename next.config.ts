import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "onetech.sgp1.cdn.digitaloceanspaces.com",
        pathname: "/one-tech/**",
      },
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
      },
      // Add this new pattern for sidemenclothing.com
      {
        protocol: "https",
        hostname: "sidemenclothing.com",
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;