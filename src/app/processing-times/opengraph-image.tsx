import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "USCIS processing times. How long USCIS is taking for your form and office.";

export default function Image() {
  return ogImage({ title: "USCIS processing times", description: "How long USCIS is taking for your form and office.", art: "processing-times" });
}
