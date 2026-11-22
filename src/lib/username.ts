/** Username rules, kept in step with the profiles checks in supabase/migrations. */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 24;

const FORMAT = /^[A-Za-z0-9][A-Za-z0-9_-]{1,22}[A-Za-z0-9]$/;
const RESERVED_PART = /(uscis|trackmy|dhs|government|official)/i;
const RESERVED_WHOLE = /^(admin|administrator|support|help|moderator|mod|staff|team|root|system|null|undefined)$/i;

/** Why a username can't be used, in plain words, or null when it's fine. */
export function usernameProblem(value: string): string | null {
  const v = value.trim();
  if (v.length < USERNAME_MIN || v.length > USERNAME_MAX) return `Use ${USERNAME_MIN} to ${USERNAME_MAX} characters.`;
  if (/[^A-Za-z0-9_-]/.test(v)) return "Use only letters, numbers, - and _.";
  if (!FORMAT.test(v)) return "Start and end with a letter or number.";
  if (RESERVED_PART.test(v) || RESERVED_WHOLE.test(v)) return "That username could look official. Please pick another.";
  return null;
}
