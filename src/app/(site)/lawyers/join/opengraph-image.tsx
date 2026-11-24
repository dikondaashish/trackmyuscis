import { directoryFee } from "@/lib/directory";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "List your immigration practice on TrackMyUSCIS. For licensed attorneys and accredited representatives.";

export default function Image() {
  return ogImage({ title: "List your immigration practice", description: `Free during launch, then ${directoryFee}. Every license is checked.`, art: "lawyers-page" });
}
