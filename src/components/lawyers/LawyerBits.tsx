/**
 * Small pieces shared by the lawyer list and the profile page: the photo, the star rating,
 * the tags, the license badge and the directory card. No hooks, so they work in server and
 * client components alike.
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Languages, MapPin, Phone, ShieldCheck, Star, Video } from "lucide-react";
import { CONSULTATION_MODES, PRACTICE_AREAS, US_STATES } from "@/lib/directory";
import type { Listing, Rating } from "@/lib/directory-listings";
import { initials } from "@/lib/lawyer-photo";
import { card, focusRing } from "@/lib/ui";

export const stateName = (code: string | null) => US_STATES.find(([c]) => c === code)?.[1] ?? code ?? "";
export const areaLabel = (value: string) => PRACTICE_AREAS.find((p) => p.value === value)?.label;
export const modeTag = (value: string) => CONSULTATION_MODES.find((m) => m.value === value)?.tag;
export const modeLabel = (value: string) => CONSULTATION_MODES.find((m) => m.value === value)?.label;

/** The icon for each way of meeting. */
export function ModeIcon({ mode, className = "size-4" }: { mode: string; className?: string }) {
  const Icon = mode === "video" ? Video : mode === "phone" ? Phone : Building2;
  return <Icon aria-hidden className={className} />;
}

/** "Immigration attorney · Licensed in Texas" or "DOJ-accredited representative". */
export const roleLine = (l: Pick<Listing, "role" | "barState">) =>
  l.role === "attorney" ? `Immigration attorney · Licensed in ${stateName(l.barState)}` : "DOJ-accredited representative";

/** "Free first consultation", "First consultation $150", or null when the lawyer doesn't show a price. */
export const consultationPrice = (l: Pick<Listing, "freeConsultation" | "consultationFee">) =>
  l.freeConsultation ? "Free first consultation" : l.consultationFee ? `First consultation $${l.consultationFee.toLocaleString("en-US")}` : null;

/** Just the amount: "Free", "$150", or null. */
export const consultationAmount = (l: Pick<Listing, "freeConsultation" | "consultationFee">) =>
  l.freeConsultation ? "Free" : l.consultationFee ? `$${l.consultationFee.toLocaleString("en-US")}` : null;

/** Languages other than English, from the lawyer's own list. */
export const otherLanguages = (languages: string) =>
  languages
    .split(/\s*[,;/]\s*|\s+and\s+/i)
    .map((s) => s.trim())
    .filter((s) => s && !/^english$/i.test(s));

/** Every language, as the lawyer wrote them. */
export const allLanguages = (languages: string) =>
  languages
    .split(/\s*[,;/]\s*|\s+and\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);

const PHOTO_BOX = {
  sm: "size-14 text-title",
  md: "size-16 text-title",
  lg: "size-24 sm:size-28 text-h3",
  xl: "size-28 sm:size-36 text-h2",
} as const;
const PHOTO_SIZES = { sm: "56px", md: "64px", lg: "112px", xl: "144px" } as const;

export function LawyerPhoto({ l, size, priority = false }: { l: Pick<Listing, "photoUrl" | "fullName">; size: keyof typeof PHOTO_BOX; priority?: boolean }) {
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ice font-semibold text-blue ${PHOTO_BOX[size]}`}>
      {l.photoUrl ? (
        <Image src={l.photoUrl} alt={`Photo of ${l.fullName}`} fill sizes={PHOTO_SIZES[size]} priority={priority} className="object-cover" />
      ) : (
        <span aria-hidden>{initials(l.fullName)}</span>
      )}
    </span>
  );
}

/** "License checked" (attorneys) or "Accreditation checked" (representatives). We check every listing before it appears. */
export function VerifiedBadge({ role }: { role: Listing["role"] }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-1 text-caption font-semibold text-teal">
      <ShieldCheck aria-hidden className="size-3.5" strokeWidth={2.25} />
      {role === "attorney" ? "License checked" : "Accreditation checked"}
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
export function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex">
      <span className="sr-only">Rated {value} out of 5</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden className={`${size} ${n <= value ? "fill-blue text-blue" : "text-border"}`} strokeWidth={1.5} />
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
export function LawyerTags({ l, max = 6, languages = true }: { l: Listing; max?: number; languages?: boolean }) {
  const price = consultationPrice(l);
  const tags: { text: string; good?: boolean }[] = [
    ...(price ? [{ text: price, good: l.freeConsultation }] : []),
    ...l.consultationModes.flatMap((m) => {
      const tag = modeTag(m);
      return tag ? [{ text: tag }] : [];
    }),
    ...(languages ? otherLanguages(l.languages).map((lang) => ({ text: lang })) : []),
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

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/**
 * One lawyer in the directory. The name links to the profile and its hit area covers the whole
 * card; "Call" sits above it so people can phone straight from the list. With `preview`, the
 * card renders without links (the example on the "List your practice" page).
 */
export function ListingCard({ l, preview = false, headingLevel = "h3" }: { l: Listing; preview?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const areas = l.practiceAreas.map(areaLabel).filter(Boolean) as string[];
  const langs = allLanguages(l.languages);
  return (
    <article
      className={`group relative flex h-full flex-col ${card} p-5 transition-[border-color,translate,box-shadow] duration-200 sm:p-6 ${preview ? "shadow-[0_24px_48px_-24px_rgb(16_34_61/0.25)]" : "reveal hover:-translate-y-0.5 hover:border-blue/50 hover:shadow-[0_12px_32px_-16px_rgb(16_34_61/0.18)] motion-reduce:hover:translate-y-0"}`}
    >
      <div className="flex items-start gap-4">
        <LawyerPhoto l={l} size="md" />
        <div className="min-w-0 flex-1">
          <Heading className="text-title text-midnight">
            {preview ? (
              l.fullName
            ) : (
              <Link
                href={`/lawyers/${l.slug}`}
                className="rounded transition-colors duration-200 group-hover:text-blue after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-blue"
              >
                {l.fullName}
              </Link>
            )}
          </Heading>
          <p className="truncate text-small text-slate">{l.firmName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <VerifiedBadge role={l.role} />
            {l.rating && <RatingLine rating={l.rating} />}
          </div>
        </div>
      </div>

      <dl className="mt-4 grid gap-1.5 text-small text-midnight">
        <div className="flex items-start gap-2">
          <dt className="sr-only">Office</dt>
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-slate" />
          <dd>
            {l.officeCity}, {l.officeState} · {l.role === "attorney" ? "Attorney" : "Accredited representative"}
          </dd>
        </div>
        {langs.length > 0 && (
          <div className="flex items-start gap-2">
            <dt className="sr-only">Languages</dt>
            <Languages aria-hidden className="mt-0.5 size-4 shrink-0 text-slate" />
            <dd>{langs.join(", ")}</dd>
          </div>
        )}
      </dl>

      {areas.length > 0 && (
        <p className="mt-3 line-clamp-2 text-small text-slate">
          <span className="sr-only">Cases: </span>
          {areas.join(" · ")}
        </p>
      )}

      {/* Grows so the bottom row lines up across cards of different lengths. */}
      <div className="mt-4 flex-1">
        <LawyerTags l={l} max={4} languages={false} />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        {preview ? (
          <span className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-blue">
            <Phone aria-hidden className="size-4" />
            Call
          </span>
        ) : (
          <a
            href={telHref(l.phone)}
            className={`relative z-10 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-small font-semibold text-blue tabular-nums transition-colors duration-200 hover:text-midnight ${focusRing}`}
          >
            <Phone aria-hidden className="size-4" />
            {l.phone}
          </a>
        )}
        <span aria-hidden className="inline-flex items-center gap-1.5 text-small font-semibold text-midnight transition-colors duration-200 group-hover:text-blue">
          View profile
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </span>
      </div>
    </article>
  );
}
