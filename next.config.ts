import type { NextConfig } from "next";

/** Community profile photos are served from our Supabase project's public storage. */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    // AVIF first (sharper per byte), WebP fallback; one quality level.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Default steps plus 2560, so a 2x desktop banner (~2200px) needn't pull the 3840 file.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    // Google profile photos in the dashboard avatar, served through our image optimizer.
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/community-avatars/**" }]
        : []),
    ],
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
