import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { formatTime, getOfficePage, PT_OFFICE_PAGES } from "@/lib/processing-times";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Official USCIS processing time for this form at this field office";

export function generateStaticParams() {
  return PT_OFFICE_PAGES.map((o) => ({ slug: o.p.form.slug, office: o.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string; office: string }> }) {
  const { slug, office } = await params;
  const o = getOfficePage(slug, office);
  return ogImage({
    title: o ? `Form ${o.p.form.form} processing time in ${o.name}` : "USCIS processing times",
    description: o ? `${formatTime(o.office)} right now, from the official USCIS tool.` : undefined,
    art: "processing-times",
  });
}
