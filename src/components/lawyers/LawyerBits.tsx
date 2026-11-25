/**
 * Small pieces shared by the lawyer list and the profile page: the photo, the star rating and
 * the tags. No hooks, so they work in server and client components alike.
 */
import Image from "next/image";
import { Star } from "lucide-react";
import { CONSULTATION_MODES, PRACTICE_AREAS, US_STATES } from "@/lib/directory";
import type { Listing, Rating } from "@/lib/directory-listings";
import { initials } from "@/lib/lawyer-photo";

export const stateName = (code: string | null) => US_STATES.find(([c]) => c === code)?.[1] ?? code ?? "";
export const areaLabel = (value: string) => PRACTICE_AREAS.find((p) => p.value === value)?.label;
export const modeTag = (value: string) => CONSULTATION_MODES.find((m) => m.value === value)?.tag;

/** "Immigration attorney · Licensed in Texas" or "DOJ-accredited representative". */
export const roleLine = (l: Pick<Listing, "role" | "barState">) =>
  l.role === "attorney" ? `Immigration attorney · Licensed in ${stateName(l.barState)}` : "DOJ-accredited representative";

/** "Free first consultation", "First consultation $150", or null when the lawyer doesn't show a price. */
export const consultationPrice = (l: Pick<Listing, "freeConsultation" | "consultationFee">) =>
  l.freeConsultation ? "Free first consultation" : l.consultationFee ? `First consultation $${l.consultationFee.toLocaleString("en-US")}` : null;

/** Languages other than English, from the lawyer's own list. */
export const otherLanguages = (languages: string) =>
  languages
    .split(/\s*[,;/]\s*|\s+and\s+/i)
    .map((s) => s.trim())
    .filter((s) => s && !/^english$/i.test(s));

export function LawyerPhoto({ l, size }: { l: Pick<Listing, "photoUrl" | "fullName">; size: "sm" | "lg" }) {
  const box = size === "lg" ? "size-24 sm:size-28 text-h3" : "size-14 text-title";
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ice font-semibold text-blue ${box}`}>
      {l.photoUrl ? (
        <Image src={l.photoUrl} alt={`Photo of ${l.fullName}`} fill sizes={size === "lg" ? "112px" : "56px"} className="object-cover" />
      ) : (
        <span aria-hidden>{initials(l.fullName)}</span>
      )}
    </span>
  );
}

/** Five stars, the average and the number of reviews. Only shown when there are published reviews. */
export function RatingLine({ rating }: { rating: Rating }) {
  const full = Math.round(rating.average);
  const reviews = `${rating.count} ${rating.count === 1 ? "review" : "reviews"}`;
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-midnight">
      <span className="sr-only">
        Rated {rating.average.toFixed(1)} out of 5 from {reviews}
      </span>
      <span aria-hidden className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`size-4 ${n <= full ? "fill-blue text-blue" : "text-border"}`} strokeWidth={1.5} />
        ))}
      </span>
      <span aria-hidden className="font-semibold tabular-nums">
        {rating.average.toFixed(1)}
      </span>
      <span aria-hidden className="text-slate">
        ({reviews})
      </span>
    </span>
  );
}

/** Just the stars, for one review. */
export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex">
      <span className="sr-only">Rated {value} out of 5</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden className={`size-4 ${n <= value ? "fill-blue text-blue" : "text-border"}`} strokeWidth={1.5} />
      ))}
    </span>
  );
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-caption font-semibold ${tone === "good" ? "bg-teal/10 text-teal" : "bg-ice text-blue"}`}>
      {children}
    </span>
  );
}

/** The tags people scan for: consultation price, how they meet, and languages besides English. */
export function LawyerTags({ l, max = 6 }: { l: Listing; max?: number }) {
  const price = consultationPrice(l);
  const tags: { text: string; good?: boolean }[] = [
    ...(price ? [{ text: price, good: l.freeConsultation }] : []),
    ...l.consultationModes.flatMap((m) => {
      const tag = modeTag(m);
      return tag ? [{ text: tag }] : [];
    }),
    ...otherLanguages(l.languages).map((lang) => ({ text: lang })),
  ].slice(0, max);
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Highlights">
      {tags.map((t) => (
        <li key={t.text}>
          <Tag tone={t.good ? "good" : "neutral"}>{t.text}</Tag>
        </li>
      ))}
    </ul>
  );
}
