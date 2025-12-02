// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//     images: {
//       domains: [
//         "utfs.io"
//       ]
//     },
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["utfs.io"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh", // allow all subdomains like qi7egtx8yo.ufs.sh
        pathname: "**",
      },
    ],
  },

  /* config options here */
  reactCompiler: true,
};

export default nextConfig;




