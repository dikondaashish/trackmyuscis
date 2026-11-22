import { ANSWERS, getAnswer } from "@/lib/answers";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "A USCIS question answered in plain English";

export function generateStaticParams() {
  return ANSWERS.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const a = getAnswer((await params).slug);
  return ogImage({ title: a?.question ?? "USCIS questions, answered", description: a?.short });
}
