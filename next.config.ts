import type { NextConfig } from "next";

// Static export for GitHub Pages. The site is served under /<repo-name>, so
// basePath makes both routes and the /_next asset URLs resolve under that
// subpath. Override via NEXT_PUBLIC_BASE_PATH when hosting elsewhere.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/organa-consulta-demo";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
