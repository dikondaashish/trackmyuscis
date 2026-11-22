/** Community profile rules, kept in step with the profiles checks in supabase/migrations. */
export const COMMUNITY_NAME_MAX = 40;
export const COMMUNITY_BIO_MAX = 160;
export const COMMUNITY_PHOTO_MAX_BYTES = 2 * 1024 * 1024;
export const COMMUNITY_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const COMMUNITY_BUCKET = "community-avatars";

const OFFICIAL = /(uscis|trackmy|dhs|government|official)/i;

/** Why a display name can't be used, or null when it's fine (empty means "use the username"). */
export function communityNameProblem(value: string): string | null {
  const v = value.trim();
  if (v.length > COMMUNITY_NAME_MAX) return `Use ${COMMUNITY_NAME_MAX} characters or fewer.`;
  if (OFFICIAL.test(v)) return "That name could look official. Please pick another.";
  return null;
}

/** Why a photo can't be used, or null. */
export function communityPhotoProblem(file: File): string | null {
  if (!COMMUNITY_PHOTO_TYPES.includes(file.type)) return "Use a PNG, JPG or WebP image.";
  if (file.size > COMMUNITY_PHOTO_MAX_BYTES) return "Use an image under 2 MB.";
  return null;
}

/** Public URL of a photo in the community-avatars bucket. */
export function communityPhotoUrl(path: string | null | undefined): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!path || !base) return null;
  return `${base}/storage/v1/object/public/${COMMUNITY_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/** First letter of the display name or username, for the photo placeholder. */
export function communityInitial(name: string | null, username: string | null): string {
  return (name?.trim() || username || "?").slice(0, 1).toUpperCase();
}
