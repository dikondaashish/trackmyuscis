import { GUIDES, getGuide } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { GUIDE_PHOTOS } from "@/lib/photos";
import { ogArt } from "@/lib/photo-file";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Immigration guide from TrackMyUSCIS";

export function generateStaticParams() {
  return GUIDES.map((x) => ({ slug: x.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug);
  return ogImage({ title: g?.title ?? "Immigration guides", description: g?.summary, art: ogArt(g && GUIDE_PHOTOS[g.slug]) });
}
