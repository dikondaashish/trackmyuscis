/**
 * Documents: the types people keep, expiry math, and list filtering. Shared by the page, the
 * API routes and the reminder emails. Dates are calendar dates (YYYY-MM-DD), compared in UTC so
 * the server and the browser agree.
 */

export type VaultDocument = {
  id: string;
  filename: string;
  category: string;
  issueDate: string | null;
  expiryDate: string | null;
  summary: string;
  extractedFields: Record<string, string>;
  aiConfidence: number | null;
  uploadedAt: string;
  fileType: string;
  fileSize: number;
};

/** The known types, in the order the filter and the type picker show them. */
export const DOCUMENT_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "visa", label: "Visa" },
  { value: "green_card", label: "Green card" },
  { value: "ead_card", label: "Work permit (EAD)" },
  { value: "receipt_notice", label: "Receipt notice (I-797C)" },
  { value: "approval_notice", label: "Approval notice (I-797)" },
  { value: "i94", label: "I-94 record" },
  { value: "i20", label: "I-20" },
  { value: "ds2019", label: "DS-2019" },
  { value: "travel_document", label: "Travel document" },
  { value: "birth_certificate", label: "Birth certificate" },
  { value: "marriage_certificate", label: "Marriage certificate" },
  { value: "naturalization_certificate", label: "Citizenship certificate" },
  { value: "drivers_license", label: "Driver's license or ID" },
  { value: "employment_letter", label: "Job offer or employment letter" },
  { value: "other", label: "Other" },
] as const;

export const KNOWN_TYPES = new Set<string>(DOCUMENT_TYPES.map((t) => t.value));

const LABELS: Record<string, string> = Object.fromEntries(DOCUMENT_TYPES.map((t) => [t.value, t.label]));

/** "green_card" → "Green card"; a type someone typed ("lease_agreement") → "Lease agreement". */
export function documentTypeLabel(value: string) {
  if (LABELS[value]) return LABELS[value];
  // Short codes someone typed ("dl", "ssn") read as capitals.
  if (/^[a-z]{1,3}$/.test(value)) return value.toUpperCase();
  const words = value.replace(/_/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "Other";
}

/** What a custom type is saved as: lowercase words joined by underscores, at most 40 characters. */
export function normalizeType(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const DAILY_UPLOADS = 20;
export const FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;
export const FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";

/** Days before expiry when a reminder email goes out (0 is the day itself). */
export const REMINDER_DAYS = [60, 45, 30, 20, 10, 5, 0] as const;

/** Lock settings people can choose (minutes; 0 means never lock on its own). */
export const AUTO_LOCK_CHOICES = [0, 5, 15, 30, 60] as const;
export const LOCKOUT_CHOICES = [1, 2, 3, 5, 10, 15, 30] as const;

const DAY_MS = 86_400_000;

function calendar(value: string | null): number | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(value);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  return back.getUTCFullYear() === y && back.getUTCMonth() === mo - 1 && back.getUTCDate() === d ? t : null;
}

export const isCalendarDate = (value: string | null) => calendar(value) !== null;

/** Whole days from `today` (YYYY-MM-DD) to the date: 0 is today, negative is past. */
export function daysUntil(value: string | null, today: string) {
  const a = calendar(value);
  const b = calendar(today);
  return a === null || b === null ? null : Math.round((a - b) / DAY_MS);
}

/** Today as YYYY-MM-DD in the browser's time zone. Call it only in the browser. */
export function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const longDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export function showDate(value: string | null) {
  const t = calendar(value);
  return t === null ? null : longDate.format(t);
}

export type ExpiryState = "none" | "expired" | "today" | "soon" | "upcoming" | "valid";

/** expired · today · soon (30 days) · upcoming (90 days) · valid · none. */
export function expiryState(days: number | null): ExpiryState {
  if (days === null) return "none";
  if (days < 0) return "expired";
  if (days === 0) return "today";
  if (days <= 30) return "soon";
  if (days <= 90) return "upcoming";
  return "valid";
}

/** "Expired 3 days ago", "Expires today", "Expires in 12 days", "Valid until Mar 4, 2031". */
export function expiryPhrase(expiry: string | null, days: number | null) {
  if (days === null) return "No expiry date";
  if (days < 0) return `Expired ${-days === 1 ? "yesterday" : `${-days} days ago`}`;
  if (days === 0) return "Expires today";
  if (days <= 90) return `Expires in ${days === 1 ? "1 day" : `${days} days`}`;
  return `Valid until ${showDate(expiry)}`;
}

export type SortKey = "newest" | "oldest" | "expiring" | "name";
export const SORTS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "expiring", label: "Expiring first" },
  { value: "name", label: "Name (A–Z)" },
];

export function filterAndSort(documents: VaultDocument[], type: string, search: string, sort: SortKey) {
  const q = search.trim().toLowerCase();
  const list = documents.filter(
    (d) =>
      (type === "all" || d.category === type) &&
      (!q || [d.filename, d.summary, documentTypeLabel(d.category)].some((v) => v.toLowerCase().includes(q))),
  );
  return list.sort((a, b) => {
    if (sort === "name") return a.filename.localeCompare(b.filename);
    if (sort === "expiring") {
      const x = calendar(a.expiryDate) ?? Infinity;
      const y = calendar(b.expiryDate) ?? Infinity;
      return x - y || a.filename.localeCompare(b.filename);
    }
    const diff = Date.parse(a.uploadedAt) - Date.parse(b.uploadedAt);
    return (sort === "oldest" ? diff : -diff) || a.filename.localeCompare(b.filename);
  });
}

/** Database row → what the page uses. */
export type DocumentRow = {
  id: string;
  filename: string;
  category: string;
  issue_date: string | null;
  expiry_date: string | null;
  summary: string | null;
  extracted_fields: Record<string, unknown> | null;
  ai_confidence: number | null;
  uploaded_at: string;
  file_type: string;
  file_size: number;
};
export const DOCUMENT_COLUMNS =
  "id, filename, category, issue_date, expiry_date, summary, extracted_fields, ai_confidence, uploaded_at, file_type, file_size";

export function toVaultDocument(row: DocumentRow): VaultDocument {
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(row.extracted_fields ?? {})) {
    if (v !== null && v !== undefined && String(v).trim()) fields[k] = String(v);
  }
  return {
    id: row.id,
    filename: row.filename,
    category: row.category,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    summary: row.summary ?? "",
    extractedFields: fields,
    aiConfidence: row.ai_confidence,
    uploadedAt: row.uploaded_at,
    fileType: row.file_type,
    fileSize: row.file_size,
  };
}

/** "passport_number" → "Passport number". */
const ACRONYMS: Record<string, string> = { uscis: "USCIS", sevis: "SEVIS", id: "ID", ead: "EAD", dob: "DOB", i94: "I-94", ds2019: "DS-2019", us: "U.S." };
export const fieldLabel = (key: string) => {
  const words = key.split("_").filter(Boolean).map((w) => ACRONYMS[w] ?? w);
  if (words.length === 0) return key;
  const first = words[0];
  words[0] = ACRONYMS[key.split("_")[0]] ? first : first[0].toUpperCase() + first.slice(1);
  return words.join(" ");
};

export function fileSizeLabel(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
