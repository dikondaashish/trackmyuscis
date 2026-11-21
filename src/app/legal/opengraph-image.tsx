import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Legal. Terms, privacy and every policy in one place.";

export default function Image() {
  return ogImage({ title: "Legal", description: "Terms, privacy and every policy in one place.", art: "brand" });
}
