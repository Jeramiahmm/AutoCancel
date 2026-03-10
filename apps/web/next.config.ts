import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  transpilePackages: ["@autocancel/shared"],
};

export default nextConfig;
