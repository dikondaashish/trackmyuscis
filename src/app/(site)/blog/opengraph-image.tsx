import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "TrackMyUSCIS blog. Plain-English updates on USCIS cases.";

export default function Image() {
  return ogImage({ title: "TrackMyUSCIS blog", description: "Plain-English updates on USCIS cases.", art: "blog-november-2026-visa-bulletin" });
}
