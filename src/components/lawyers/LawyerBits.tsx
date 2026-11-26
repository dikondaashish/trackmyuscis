/**
 * Small pieces shared by the lawyer list and the profile page: the photo, the star rating,
 * the tags, the license badge and the directory card. No hooks, so they work in server and
 * client components alike.
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, CalendarCheck, Languages, MapPin, Phone, ShieldCheck, Star, Video } from "lucide-react";
import { CONSULTATION_MODES, PRACTICE_AREAS, US_STATES } from "@/lib/directory";
import type { Listing, Rating } from "@/lib/directory-listings";
import { initials } from "@/lib/lawyer-photo";
import { card, focusRing } from "@/lib/ui";

export const stateName = (code: string | null) => US_STATES.find(([c]) => c === code)?.[1] ?? code ?? "";
export const areaLabel = (value: string) => PRACTICE_AREAS.find((p) => p.value === value)?.label;
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

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** A small teal shield after a name: the license or accreditation was checked. Its meaning is spelled out for screen readers and on hover. */
export function VerifiedMark({ role }: { role: Listing["role"] }) {
  const label = role === "attorney" ? "License checked by TrackMyUSCIS" : "Accreditation checked by TrackMyUSCIS";
  return (
    <span title={label} className="inline-flex shrink-0 text-teal">
      <ShieldCheck aria-hidden className="size-[1.05em]" strokeWidth={2.25} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** "Free first consultation · Video, Phone, In person". */
export function ConsultationLine({ l }: { l: Listing }) {
  const price = consultationPrice(l);
  const modes = l.consultationModes.map(modeLabel).filter(Boolean).join(", ");
  if (!price && !modes) return null;
  return (
    <>
      {price && <span className={l.freeConsultation ? "font-semibold text-teal" : "font-semibold text-midnight"}>{price}</span>}
      {price && modes && <span className="text-slate"> · </span>}
      {modes && <span>{modes}</span>}
    </>
  );
}

/**
 * One lawyer in the directory. The name links to the profile and its hit area covers the whole
 * card; the phone number sits above it so people can call straight from the list. With
 * `preview`, the card renders without links (the example on the "List your practice" page).
 */
export function ListingCard({ l, preview = false }: { l: Listing; preview?: boolean }) {
  // The example card is a picture of a listing, not a section of the page, so its name is not a heading.
  const Heading = preview ? "p" : "h3";
  const areas = l.practiceAreas.map(areaLabel).filter(Boolean) as string[];
  const langs = allLanguages(l.languages);
  const consultation = ConsultationLine({ l });
  return (
    <article
      className={`group relative flex h-full flex-col ${card} transition-[border-color,translate,box-shadow] duration-200 ${preview ? "" : "reveal hover:-translate-y-0.5 hover:border-blue/40 hover:shadow-[0_16px_40px_-20px_rgb(16_34_61/0.22)] motion-reduce:hover:translate-y-0"}`}
    >
      <div className="flex items-start gap-4 p-5 sm:p-6">
        <LawyerPhoto l={l} size="md" />
        <div className="min-w-0 flex-1">
          <Heading className="flex items-center gap-1.5 text-title text-midnight">
            {preview ? (
              <span className="truncate">{l.fullName}</span>
            ) : (
              <Link
                href={`/lawyers/${l.slug}`}
                className="truncate rounded transition-colors duration-200 group-hover:text-blue after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-blue"
              >
                {l.fullName}
              </Link>
            )}
            <VerifiedMark role={l.role} />
          </Heading>
          <p className="truncate text-small text-slate">
            {l.role === "attorney" ? "Attorney" : "Accredited representative"} · {l.firmName}
          </p>
          {l.rating && (
            <p className="mt-1.5">
              <RatingLine rating={l.rating} />
            </p>
          )}
        </div>
      </div>

      <dl className="grid flex-1 content-start gap-2 border-t border-border px-5 py-4 text-small text-midnight sm:px-6">
        <div className="flex items-start gap-2.5">
          <dt className="sr-only">Office</dt>
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-slate" />
          <dd>
            {l.officeCity}, {stateName(l.officeState)}
          </dd>
        </div>
        {consultation && (
          <div className="flex items-start gap-2.5">
            <dt className="sr-only">Consultations</dt>
            <CalendarCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-slate" />
            <dd>{consultation}</dd>
          </div>
        )}
        {langs.length > 0 && (
          <div className="flex items-start gap-2.5">
            <dt className="sr-only">Languages</dt>
            <Languages aria-hidden className="mt-0.5 size-4 shrink-0 text-slate" />
            <dd>{langs.join(", ")}</dd>
          </div>
        )}
        {areas.length > 0 && (
          <div className="flex items-start gap-2.5">
            <dt className="sr-only">Cases</dt>
            <Briefcase aria-hidden className="mt-0.5 size-4 shrink-0 text-slate" />
            <dd className="line-clamp-2 text-slate">{areas.join(", ")}</dd>
          </div>
        )}
      </dl>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-2 sm:px-6">
        {preview ? (
          <span className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-blue tabular-nums">
            <Phone aria-hidden className="size-4" />
            Your office number
          </span>
        ) : (
          <a
            href={telHref(l.phone)}
            className={`relative z-10 -ml-1 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-small font-semibold text-blue tabular-nums transition-colors duration-200 hover:text-midnight ${focusRing}`}
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
