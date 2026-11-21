import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrackMyUSCIS",
    short_name: "TrackMyUSCIS",
    description: "Free USCIS case tracker: receipt numbers, case statuses and processing times in plain English.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#FFFFFF",
    icons: [
      { src: "/brand/logo-app.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
      { src: "/brand/logo-app-fullbleed.png", sizes: "1024x1024", type: "image/png", purpose: "maskable" },
    ],
  };
}
