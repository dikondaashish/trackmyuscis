/**
 * Biometrics from a case's USCIS text. USCIS says when an appointment is scheduled, and
 * sometimes later that fingerprints were taken, reused or waived. Until it says one of
 * those, we ask the person whether they went (their own record, never the USCIS status).
 */

type HistoryItem = { date?: string | null; completedText?: string | null };

export type BiometricsState =
  /** USCIS never mentioned biometrics. */
  | "none"
  /** Mentioned (for example the fee), but no appointment yet. */
  | "pending"
  /** An appointment was scheduled and USCIS hasn't said it happened. */
  | "scheduled"
  /** USCIS says fingerprints were taken or applied. */
  | "completed"
  /** USCIS reused earlier biometrics. */
  | "reused"
  /** USCIS waived them. */
  | "waived";

const mentionsBiometrics = (text: string) => /biometric|fingerprint/.test(text);

/** Reads every sentence of the current status and history, oldest information included. */
export function biometricsState(currentStatus: string | null, history: HistoryItem[] | null): BiometricsState {
  const texts = [currentStatus, ...(Array.isArray(history) ? history : []).map((h) => h?.completedText)];
  let result: BiometricsState = "none";
  for (const text of texts) {
    if (!text) continue;
    for (const sentence of text.toLowerCase().split(/[.!?]/)) {
      if (!mentionsBiometrics(sentence)) continue;
      if (result === "none") result = "pending";
      if (/\b(fee|payment)\b/.test(sentence)) continue;
      if (/\bappointment\b/.test(sentence) && /\bscheduled\b/.test(sentence) && !/\b(not|cancelled|canceled)\b/.test(sentence)) {
        if (result === "pending") result = "scheduled";
        continue;
      }
      if (/\b(not|never|awaiting|pending|will|must|need to|unable|failed)\b/.test(sentence)) continue;
      if (/\b(completed|taken|applied|captured|collected|processed)\b/.test(sentence)) return "completed";
      if (/\b(reused|reusing)\b/.test(sentence)) result = "reused";
      else if (/\bwaived\b/.test(sentence) && result !== "reused") result = "waived";
    }
  }
  return result;
}

/** A decision or a card: past the point where asking about biometrics makes sense. */
const decided = (status: string | null) =>
  !!status && /approved|card was|card is being|denied|rejected|withdrawn|terminated|closed/i.test(status);

/** Ask "did you go?" only while an appointment is scheduled and the case is still open. */
export const asksBiometrics = (currentStatus: string | null, history: HistoryItem[] | null) =>
  biometricsState(currentStatus, history) === "scheduled" && !decided(currentStatus);

/** The scheduled entry's date as YYYY-MM-DD, the earliest a person could have gone. */
export function biometricsScheduledOn(history: HistoryItem[] | null): string | null {
  for (const h of Array.isArray(history) ? history : []) {
    const text = h?.completedText?.toLowerCase() ?? "";
    if (!mentionsBiometrics(text) || !/\bscheduled\b/.test(text) || typeof h?.date !== "string") continue;
    const us = /^(\d{2})-(\d{2})-(\d{4})/.exec(h.date.trim());
    if (us) return `${us[3]}-${us[1]}-${us[2]}`;
    const iso = /^(\d{4}-\d{2}-\d{2})/.exec(h.date.trim());
    if (iso) return iso[1];
  }
  return null;
}
