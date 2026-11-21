import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "USCIS forms explained. What each common form is for and the steps after you file.";

export default function Image() {
  return ogImage({ title: "USCIS forms explained", description: "What each common form is for and the steps after you file.", art: "brand" });
}
