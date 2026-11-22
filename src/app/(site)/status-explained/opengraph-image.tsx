import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "USCIS case statuses explained. What each status means and what usually comes next.";

export default function Image() {
  return ogImage({ title: "USCIS case statuses explained", description: "What each status means and what usually comes next.", art: "status-explained" });
}
