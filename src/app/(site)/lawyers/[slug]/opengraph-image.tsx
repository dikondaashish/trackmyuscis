import { getListing, listedLawyers } from "@/lib/directory-listings";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "An immigration lawyer's profile on TrackMyUSCIS";

export async function generateStaticParams() {
  const listings = await listedLawyers();
  return listings.length > 0 ? listings.map((l) => ({ slug: l.slug })) : [{ slug: "no-lawyers-listed-yet" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const l = await getListing((await params).slug);
  return ogImage({
    title: l ? l.fullName : "Find an immigration lawyer",
    description: l ? `${l.role === "attorney" ? "Immigration attorney" : "Accredited representative"} at ${l.firmName}, ${l.officeCity}, ${l.officeState}.` : undefined,
    art: "lawyers-page",
  });
}
