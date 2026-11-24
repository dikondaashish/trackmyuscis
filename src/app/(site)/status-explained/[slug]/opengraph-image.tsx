import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { getStatusPage, STATUS_DETAIL_PAGES, statusId } from "@/lib/statuses";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "What this USCIS case status means and what usually comes next";

export function generateStaticParams() {
  return STATUS_DETAIL_PAGES.map((s) => ({ slug: statusId(s.name) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const s = getStatusPage((await params).slug);
  return ogImage({ title: s?.name ?? "USCIS case statuses explained", description: s?.meaning, art: "status-explained" });
}
