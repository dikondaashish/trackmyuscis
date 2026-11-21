/**
 * USCIS receipt number helpers.
 * Format: 3-letter office prefix + 10 digits (e.g. IOE0912345678, MSC2190123456).
 * Digits 1–2 = fiscal year, 3–5 = computer workday, 6–10 = case sequence.
 */

export const SERVICE_CENTERS: Record<string, string> = {
  IOE: "USCIS online filing (ELIS)",
  EAC: "Vermont Service Center",
  VSC: "Vermont Service Center",
  WAC: "California Service Center",
  CSC: "California Service Center",
  LIN: "Nebraska Service Center",
  NSC: "Nebraska Service Center",
  SRC: "Texas Service Center",
  TSC: "Texas Service Center",
  MSC: "National Benefits Center",
  NBC: "National Benefits Center",
  YSC: "Potomac Service Center",
};

export type ReceiptCheck =
  | { ok: true; receipt: string; prefix: string; office: string | null; fiscalYear: number }
  | { ok: false; receipt: string; error: string };

export function normalizeReceipt(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function checkReceipt(raw: string): ReceiptCheck {
  const receipt = normalizeReceipt(raw);
  if (!receipt) return { ok: false, receipt, error: "Enter your 13-character receipt number." };
  if (!/^[A-Z]{3}\d{10}$/.test(receipt)) {
    return {
      ok: false,
      receipt,
      error: "Receipt numbers are 3 letters followed by 10 digits, like IOE0912345678.",
    };
  }
  const prefix = receipt.slice(0, 3);
  return {
    ok: true,
    receipt,
    prefix,
    office: SERVICE_CENTERS[prefix] ?? null,
    fiscalYear: 2000 + Number(receipt.slice(3, 5)),
  };
}
