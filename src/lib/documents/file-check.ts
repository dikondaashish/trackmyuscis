/**
 * Upload checks, done on the server from the file's own bytes (never the browser's claimed
 * type): a real PDF, JPEG, PNG or WebP, an extension that matches, and nothing executable.
 */

export type SafeType = "application/pdf" | "image/jpeg" | "image/png" | "image/webp";

export function detectType(bytes: Uint8Array): SafeType | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));
  if (bytes.length >= 5 && ascii(0, 5) === "%PDF-") return "application/pdf";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && png.every((b, i) => bytes[i] === b)) return "image/png";
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

const EXTENSIONS: Record<SafeType, string[]> = {
  "application/pdf": ["pdf"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
};

export const EXTENSION_FOR: Record<SafeType, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function extensionMatches(filename: string, type: SafeType) {
  const ext = filename.toLowerCase().trim().split(".").pop();
  return !!ext && EXTENSIONS[type].includes(ext);
}

const BLOCKED = [".exe", ".bat", ".cmd", ".com", ".pif", ".scr", ".vbs", ".js", ".jar", ".zip", ".rar", ".7z", ".html", ".svg"];

/** Names like "scan.pdf.exe" or "notice.html". */
export function looksExecutable(filename: string) {
  const name = filename.toLowerCase().trim();
  return BLOCKED.some((ext) => name.endsWith(ext) || name.includes(`${ext}.`));
}

/** A tidy display name: no folders, no control characters, at most 255 characters. */
export function cleanFilename(filename: string) {
  const base = filename.split(/[\\/]/).pop() ?? "document";
  const clean = base.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return (clean || "document").slice(0, 255);
}
