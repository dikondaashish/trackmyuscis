import { BLOG_POSTS, getPost } from "@/lib/blog";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blog post from TrackMyUSCIS";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

/** The post's title beside its cover (crop in src/assets/og/blog-<slug>.jpg). */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  return ogImage({ title: p?.title ?? "TrackMyUSCIS blog", description: p?.topic, art: p ? `blog-${p.slug}` : "brand" });
}
