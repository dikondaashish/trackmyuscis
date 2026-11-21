import { FORMS, getForm } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "USCIS form explained: what it is for and the steps after you file";

export function generateStaticParams() {
  return FORMS.map((x) => ({ slug: x.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const f = getForm((await params).slug);
  return ogImage({
    title: f ? `Form ${f.form}: ${f.label}` : "USCIS forms explained",
    description: f ? `${f.title}. What it is for and the steps after you file.` : undefined,
    art: f ? `form-${f.slug}` : "brand",
  });
}
