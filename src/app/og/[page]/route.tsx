import { notFound } from "next/navigation";
import { TEXT_PAGES } from "@/lib/content";
import { LEGAL_DOCS } from "@/lib/legal";
import { ogImage } from "@/lib/og";
import { TEXT_PAGE_PHOTOS } from "@/lib/photos";
import { ogArt } from "@/lib/photo-file";

/**
 * Share cards for the catch-all text and legal pages (an opengraph-image file can't live
 * inside a catch-all segment). Prerendered for every known page; anything else is a 404.
 */
export function generateStaticParams() {
  return [...Object.keys(TEXT_PAGES), ...Object.keys(LEGAL_DOCS)].map((page) => ({ page }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ page: string }> }) {
  const key = (await params).page;
  const doc = LEGAL_DOCS[key];
  const page = TEXT_PAGES[key];
  if (!doc && !page) notFound();
  return ogImage({
    title: doc?.title ?? page.title,
    description: doc?.summary ?? page.lead,
    art: ogArt(TEXT_PAGE_PHOTOS[key]),
  });
}
