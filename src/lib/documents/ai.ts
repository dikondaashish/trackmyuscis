import { DOCUMENT_TYPES, KNOWN_TYPES, isCalendarDate } from "@/lib/documents/types";

/**
 * Reads an uploaded document with Google's Gemini API: the type, issue and expiry dates, the key
 * fields and a one-line summary, in one call. Server only (GOOGLE_API_KEY). The full text isn't
 * kept, only the fields. When the key is missing or the call fails, the upload still saves and
 * the person fills in the details themselves.
 */

export type DocumentAnalysis = {
  category: string;
  confidence: number;
  issueDate: string | null;
  expiryDate: string | null;
  summary: string;
  fields: Record<string, string>;
};

export const EMPTY_ANALYSIS: DocumentAnalysis = {
  category: "other",
  confidence: 0,
  issueDate: null,
  expiryDate: null,
  summary: "",
  fields: {},
};

const MODEL = process.env.DOCUMENT_AI_MODEL || "gemini-3.5-flash";
const TIMEOUT_MS = 60_000;

export const documentAiEnabled = () => !!process.env.GOOGLE_API_KEY;

const PROMPT = `You read U.S. immigration documents for the person who owns them.
Look at this document and return JSON only.

documentType: one of ${DOCUMENT_TYPES.map((t) => t.value).join(", ")}.
- green_card: Permanent Resident Card (Form I-551).
- ead_card: Employment Authorization Document (Form I-766).
- receipt_notice: Form I-797C notice that USCIS received a case.
- approval_notice: Form I-797 or I-797A approval notice.
- i94: Arrival/Departure record.
- travel_document: advance parole, reentry permit or refugee travel document (Form I-512 or I-327/I-571).
- naturalization_certificate: certificate of naturalization or citizenship.
- employment_letter: job offer, employment verification or pay letter.
- Use other when none fit.

confidence: 0 to 100, how sure you are of documentType.
issueDate, expiryDate: YYYY-MM-DD, or null when the document doesn't show one. For an I-797 approval
notice use the "valid to" date as expiryDate. For an I-94 use the "admit until" date (null for D/S).
Never guess a date that isn't printed.
summary: one short sentence describing the document, without copying ID numbers.
expiryDate is the date the document stops being valid: "Card Expires", "Date of Expiration", "Expires", "Valid To" or "Admit Until".
fields: the key facts printed on it, as a list of { key, value } with snake_case keys and short values. Examples:
- passport: full_name, passport_number, nationality, issuing_country, date_of_birth
- green_card / ead_card: full_name, uscis_number, category, card_number, country_of_birth
- receipt_notice / approval_notice: receipt_number, form, case_type, applicant_name, received_date, notice_date, valid_from, valid_to, priority_date
- visa: visa_type, entries, issuing_post, control_number
- i94: admission_number, class_of_admission, admit_until, most_recent_entry
- i20 / ds2019: sevis_id, school_or_program, program_end_date
Only include fields you can read clearly. At most 20 fields.`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    documentType: { type: "STRING" },
    confidence: { type: "INTEGER" },
    issueDate: { type: "STRING", nullable: true },
    expiryDate: { type: "STRING", nullable: true },
    summary: { type: "STRING" },
    fields: {
      type: "ARRAY",
      items: { type: "OBJECT", properties: { key: { type: "STRING" }, value: { type: "STRING" } }, required: ["key", "value"] },
    },
  },
  required: ["documentType", "confidence", "issueDate", "expiryDate", "summary", "fields"],
};

function clean(raw: unknown): DocumentAnalysis {
  if (!raw || typeof raw !== "object") return EMPTY_ANALYSIS;
  const r = raw as Record<string, unknown>;
  const type = typeof r.documentType === "string" ? r.documentType.trim().toLowerCase() : "";
  const confidence = Math.round(Number(r.confidence));
  const date = (v: unknown) => (typeof v === "string" && isCalendarDate(v.slice(0, 10)) ? v.slice(0, 10) : null);
  const fields: Record<string, string> = {};
  // A list of { key, value } (the schema), or a plain object.
  const pairs: [string, unknown][] = Array.isArray(r.fields)
    ? r.fields.flatMap((f) => (f && typeof f === "object" && "key" in f ? [[String(f.key), (f as { value?: unknown }).value] as [string, unknown]] : []))
    : r.fields && typeof r.fields === "object"
      ? Object.entries(r.fields as Record<string, unknown>)
      : [];
  for (const [k, v] of pairs.slice(0, 20)) {
    const key = k.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40);
    const value = typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, 200) : "";
    if (key && value) fields[key] = value;
  }
  return {
    category: KNOWN_TYPES.has(type) ? type : "other",
    confidence: Number.isFinite(confidence) ? Math.min(100, Math.max(0, confidence)) : 0,
    issueDate: date(r.issueDate),
    expiryDate: date(r.expiryDate),
    summary: typeof r.summary === "string" ? r.summary.trim().slice(0, 300) : "",
    fields,
  };
}

export async function analyzeDocument(bytes: Uint8Array, mimeType: string): Promise<DocumentAnalysis> {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return EMPTY_ANALYSIS;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: PROMPT }, { inlineData: { mimeType, data: Buffer.from(bytes).toString("base64") } }],
          },
        ],
        generationConfig: { responseMimeType: "application/json", responseSchema: SCHEMA, temperature: 0 },
      }),
    });
    if (!res.ok) {
      console.error(`Document AI failed with HTTP ${res.status}`);
      return EMPTY_ANALYSIS;
    }
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    return json ? clean(JSON.parse(json)) : EMPTY_ANALYSIS;
  } catch {
    console.error("Document AI failed");
    return EMPTY_ANALYSIS;
  }
}
