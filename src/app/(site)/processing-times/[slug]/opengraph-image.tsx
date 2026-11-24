import { getPtForm, PT_FORMS, rangeText } from "@/lib/processing-times";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Official USCIS processing time for this form, by office and category";

export function generateStaticParams() {
  return PT_FORMS.map((p) => ({ slug: p.form.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPtForm((await params).slug);
  return ogImage({
    title: p ? `Form ${p.form.form} processing time` : "USCIS processing times",
    description: p ? `${rangeText(p)} right now, from the official USCIS tool.` : undefined,
    art: "processing-times",
  });
}
