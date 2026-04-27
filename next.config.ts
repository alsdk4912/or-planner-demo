import type { NextConfig } from "next";

const repoName = "or-v";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}`,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
