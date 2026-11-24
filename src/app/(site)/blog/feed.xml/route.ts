import { AUTHORS, BLOG_POSTS, BLOG_UPDATED } from "@/lib/blog";
import { abs } from "@/lib/seo";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString();

/** RSS 2.0 feed of every blog post, newest first. Built from the post data, so it never drifts. */
export function GET() {
  const items = BLOG_POSTS.map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${abs(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${abs(`/blog/${p.slug}`)}</guid>
      <pubDate>${rfc822(p.published)}</pubDate>
      <dc:creator>${esc(AUTHORS[p.author].name)}</dc:creator>
      <category>${esc(p.topic)}</category>
      <description>${esc(p.answer)}</description>
    </item>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>TrackMyUSCIS blog</title>
    <link>${abs("/blog")}</link>
    <atom:link href="${abs("/blog/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>Plain-English updates on USCIS cases, checked against official sources.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(BLOG_UPDATED)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
