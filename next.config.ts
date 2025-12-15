import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'f7f948mkor.ufs.sh',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;