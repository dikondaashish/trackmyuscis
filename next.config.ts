import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    // AVIF first (sharper per byte), WebP fallback; one quality level.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Default steps plus 2560, so a 2x desktop banner (~2200px) needn't pull the 3840 file.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
