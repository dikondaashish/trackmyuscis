/** Blog bylines. Shown as an initials avatar and a name; no titles or credentials are claimed. */
export const AUTHORS = {
  karthik: { name: "Karthik Raman", initials: "KR" },
  charlie: { name: "Charlie Mitchell", initials: "CM" },
  kiran: { name: "Kiran Kumar Reddy", initials: "KK" },
  surya: { name: "Surya Narayanan", initials: "SN" },
} as const;

export type AuthorId = keyof typeof AUTHORS;
