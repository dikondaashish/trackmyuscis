/**
 * Name, initials and photo for showing who is signed in. Shared by the server (getAccount)
 * and the site header, which reads the session in the browser so pages stay static.
 */
export function accountDisplay({
  firstName,
  lastName,
  fullName,
  email,
  photo,
}: {
  firstName: string | null;
  lastName: string | null;
  fullName?: unknown;
  email: string;
  photo?: unknown;
}) {
  const name = [firstName, lastName].filter(Boolean).join(" ") || (typeof fullName === "string" && fullName) || null;
  const initials =
    ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || email.slice(0, 1).toUpperCase() || "?";
  return { name, initials, photoUrl: googlePhoto(photo) };
}

/** Only Google's own photo host, over https; anything else falls back to initials. */
export function googlePhoto(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".googleusercontent.com") ? url.toString() : null;
  } catch {
    return null;
  }
}
