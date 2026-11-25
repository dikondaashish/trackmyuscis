/** Lawyer photos: a public storage bucket that only the server writes to. */
export const LAWYER_PHOTO_BUCKET = "lawyer-photos";
/** After the browser shrinks it to a square; the bucket refuses anything over 1 MB. */
export const LAWYER_PHOTO_MAX_BYTES = 1024 * 1024;
/** The longest side the browser keeps, in pixels: twice the largest size the photo is shown at. */
export const LAWYER_PHOTO_SIZE = 480;

/** Public URL of a photo in the lawyer-photos bucket. */
export function lawyerPhotoUrl(path: string | null | undefined): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!path || !base || !/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path)) return null;
  return `${base}/storage/v1/object/public/${LAWYER_PHOTO_BUCKET}/${path}`;
}

/** "Maria Lopez" → "ML", for the placeholder when there is no photo. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .filter((c) => /\p{L}/u.test(c))
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
