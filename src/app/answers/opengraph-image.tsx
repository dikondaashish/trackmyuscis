import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "USCIS questions answered in plain English";

export default function Image() {
  return ogImage({ title: "USCIS questions, answered", description: "Receipt numbers, case status, notices and delays in plain English." });
}
