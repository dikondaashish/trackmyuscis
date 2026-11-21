import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Track your USCIS case. Receipt numbers, case statuses and processing times in plain English.";

export default function Image() {
  return ogImage({ title: "Track your USCIS case", description: "Receipt numbers, case statuses and processing times in plain English.", art: "brand" });
}
