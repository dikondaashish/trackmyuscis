import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Find an immigration lawyer. Where to find real legal help and how to check a lawyer.";

export default function Image() {
  return ogImage({ title: "Find an immigration lawyer", description: "Where to find real legal help and how to check a lawyer.", art: "lawyers-page" });
}
