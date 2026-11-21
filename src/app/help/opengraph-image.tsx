import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Help center. Receipt numbers, tracking and cost, answered.";

export default function Image() {
  return ogImage({ title: "Help center", description: "Receipt numbers, tracking and cost, answered.", art: "brand" });
}
