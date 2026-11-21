import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Immigration guides. Plain answers while your case is pending.";

export default function Image() {
  return ogImage({ title: "Immigration guides", description: "Plain answers while your case is pending.", art: "brand" });
}
