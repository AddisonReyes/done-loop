import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages static hosting.
  output: "export",
  trailingSlash: true,
  // If next/image is introduced later, static hosting needs unoptimized images.
  images: { unoptimized: true },
};

export default nextConfig;
