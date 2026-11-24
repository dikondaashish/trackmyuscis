import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "TrackMyUSCIS is free. Case tracking, tools and answers, with no card needed.";

export default function Image() {
  return ogImage({ title: "TrackMyUSCIS is free", description: "Case tracking, tools and answers, with no card needed.", art: "brand" });
}
