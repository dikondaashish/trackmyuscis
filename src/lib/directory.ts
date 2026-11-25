/**
 * The lawyer directory: what a listing costs, who can apply and the rules an application must
 * pass. The form (browser) and the server action both validate with `validateApplication`, so
 * the two can't drift apart. The price and launch terms are stated once here; the page, the
 * policies, llms.txt and the saved application all read them.
 *
 * The fee is a flat advertising fee. It is never a fee per client or a share of legal fees:
 * bar rules generally don't allow lawyers to pay for referrals or split fees with non-lawyers.
 */

export const DIRECTORY = {
  /** Flat listing fee after launch, in US dollars a year. */
  annualFee: 365,
  /** Listings are free while the directory is launching. Set to false when the fee starts. */
  freeAtLaunch: true,
  /** Days of notice by email before the first invoice, so a lawyer can leave instead of paying. */
  noticeDays: 30,
} as const;

/** "$365 a year". */
export const directoryFee = `$${DIRECTORY.annualFee} a year`;

export const PRACTICE_AREAS = [
  { value: "family", label: "Family-based green cards" },
  { value: "employment", label: "Employment-based green cards" },
  { value: "work-visas", label: "Work visas (H-1B, L-1, O-1, TN)" },
  { value: "students", label: "Students and OPT (F-1, J-1)" },
  { value: "citizenship", label: "Citizenship and naturalization" },
  { value: "asylum", label: "Asylum and humanitarian" },
  { value: "removal", label: "Deportation and removal defense" },
  { value: "waivers", label: "Waivers and appeals" },
] as const;

/** How a lawyer meets people. Shown as tags on the list and the profile. */
export const CONSULTATION_MODES = [
  { value: "video", label: "Video call", tag: "Video consultations" },
  { value: "phone", label: "Phone", tag: "Phone consultations" },
  { value: "in_person", label: "In person", tag: "In-person meetings" },
] as const;

/** The first consultation: free, a set fee, or not listed (people ask the office). */
export type ConsultationPrice = "free" | "paid" | "ask";

export const EDUCATION_MAX = 4;
export const CAREER_MAX = 5;
export const LINE_MAX = 150;

/** States and territories with their own bar, and where an office can be. */
export const US_STATES: [code: string, name: string][] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"],
  ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"],
  ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"],
  ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"],
  ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"],
  ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"],
  ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
  ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"], ["PR", "Puerto Rico"], ["GU", "Guam"],
  ["VI", "U.S. Virgin Islands"], ["MP", "Northern Mariana Islands"], ["AS", "American Samoa"],
];

export type ApplicantRole = "attorney" | "accredited_representative";

export type LawyerApplication = {
  role: ApplicantRole;
  fullName: string;
  firmName: string;
  email: string;
  phone: string;
  website: string;
  barState: string;
  barNumber: string;
  officeStreet: string;
  officeCity: string;
  officeState: string;
  officeZip: string;
  languages: string;
  practiceAreas: string[];
  consultationModes: string[];
  consultationPrice: ConsultationPrice;
  /** Dollars, when the price is "paid". */
  consultationFee: string;
  /** Year first licensed (attorneys) or accredited (representatives). Optional. */
  licensedSince: string;
  /** One school or degree per line. Optional. */
  education: string;
  /** One past role or highlight per line. Optional. */
  career: string;
  bio: string;
  /** "I confirm this is accurate and I may submit it." */
  accurate: boolean;
  /** Terms of Service and the Advertising and Lawyer Directory page. */
  agreed: boolean;
};

export type ApplicationErrors = Partial<Record<keyof LawyerApplication, string>>;

export const BIO_MIN = 40;
export const BIO_MAX = 1500;

const STATE_CODES = new Set(US_STATES.map(([code]) => code));
const AREA_VALUES = new Set<string>(PRACTICE_AREAS.map((a) => a.value));
const MODE_VALUES = new Set<string>(CONSULTATION_MODES.map((m) => m.value));

/** Non-empty trimmed lines of a text box. */
export const lines = (s: string) => s.split(/\r?\n/).map((l) => l.trim().replace(/\s+/g, " ")).filter(Boolean);

/** "María O'Brien, San Antonio, TX" → "maria-o-brien-san-antonio-tx". */
export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

/** "example.com/team" → "https://example.com/team"; empty stays empty. */
export function normalizeWebsite(value: string) {
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/** Trims every text field, so the browser and the server check the same thing. */
export function cleanApplication(a: LawyerApplication): LawyerApplication {
  return {
    ...a,
    fullName: a.fullName.trim().replace(/\s+/g, " "),
    firmName: a.firmName.trim().replace(/\s+/g, " "),
    email: a.email.trim().toLowerCase(),
    phone: a.phone.trim(),
    website: normalizeWebsite(a.website),
    barState: a.role === "attorney" ? a.barState.trim().toUpperCase() : "",
    barNumber: a.role === "attorney" ? a.barNumber.trim() : "",
    officeStreet: a.officeStreet.trim().replace(/\s+/g, " "),
    officeCity: a.officeCity.trim().replace(/\s+/g, " "),
    officeState: a.officeState.trim().toUpperCase(),
    officeZip: a.officeZip.trim(),
    languages: a.languages.trim().replace(/\s+/g, " "),
    practiceAreas: [...new Set(a.practiceAreas)].filter((v) => AREA_VALUES.has(v)),
    consultationModes: [...new Set(a.consultationModes)].filter((v) => MODE_VALUES.has(v)),
    consultationPrice: a.consultationPrice === "free" || a.consultationPrice === "paid" ? a.consultationPrice : "ask",
    consultationFee: a.consultationPrice === "paid" ? a.consultationFee.trim().replace(/^\$/, "").replace(/,/g, "") : "",
    licensedSince: a.licensedSince.trim(),
    education: lines(a.education).join("\n"),
    career: lines(a.career).join("\n"),
    bio: a.bio.trim().replace(/\n{3,}/g, "\n\n"),
  };
}

/** One plain message per field that needs fixing. An empty object means the application is fine. */
export function validateApplication(input: LawyerApplication): ApplicationErrors {
  const a = cleanApplication(input);
  const errors: ApplicationErrors = {};
  if (a.role !== "attorney" && a.role !== "accredited_representative") errors.role = "Choose attorney or accredited representative.";
  if (a.fullName.length < 2 || a.fullName.length > 80) errors.fullName = "Enter your full name.";
  if (a.firmName.length < 2 || a.firmName.length > 120)
    errors.firmName = a.role === "attorney" ? "Enter your firm's name, or your own name if you practice alone." : "Enter the name of your recognized organization.";
  if (a.email.length > 254 || !EMAIL.test(a.email)) errors.email = "Enter a work email address, like name@firm.com.";
  const digits = a.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15 || a.phone.length > 30) errors.phone = "Enter a phone number with its area code.";
  if (a.website) {
    let ok = a.website.length <= 200;
    try {
      ok = ok && new URL(a.website).hostname.includes(".");
    } catch {
      ok = false;
    }
    if (!ok) errors.website = "Enter a website address, like www.firm.com, or leave this empty.";
  }
  if (a.role === "attorney") {
    if (!STATE_CODES.has(a.barState)) errors.barState = "Choose the state bar where you are licensed.";
    if (a.barNumber.length < 2 || a.barNumber.length > 30) errors.barNumber = "Enter your bar number, so we can check your license.";
  }
  if (a.officeStreet && (a.officeStreet.length < 3 || a.officeStreet.length > 120)) errors.officeStreet = "Enter the street address, or leave this empty.";
  if (a.officeCity.length < 2 || a.officeCity.length > 60) errors.officeCity = "Enter the city of your office.";
  if (!STATE_CODES.has(a.officeState)) errors.officeState = "Choose the state of your office.";
  if (a.officeZip && !/^\d{5}(-\d{4})?$/.test(a.officeZip)) errors.officeZip = "Enter a 5-digit ZIP code, or leave this empty.";
  if (a.languages.length < 2 || a.languages.length > 120) errors.languages = "List the languages you work in, like English, Spanish.";
  if (a.practiceAreas.length === 0) errors.practiceAreas = "Choose at least one kind of case.";
  if (a.consultationModes.length === 0) errors.consultationModes = "Choose at least one way you meet people.";
  if (a.consultationPrice === "paid") {
    const fee = Number(a.consultationFee);
    if (!/^\d+$/.test(a.consultationFee) || fee < 1 || fee > 5000) errors.consultationFee = "Enter the fee in dollars, like 150.";
  }
  if (a.licensedSince) {
    const year = Number(a.licensedSince);
    if (!/^\d{4}$/.test(a.licensedSince) || year < 1950 || year > new Date().getFullYear())
      errors.licensedSince = "Enter a year, like 2012, or leave this empty.";
  }
  const education = lines(a.education);
  if (education.length > EDUCATION_MAX || education.some((l) => l.length > LINE_MAX))
    errors.education = `Use up to ${EDUCATION_MAX} lines of ${LINE_MAX} characters or fewer.`;
  const career = lines(a.career);
  if (career.length > CAREER_MAX || career.some((l) => l.length > LINE_MAX))
    errors.career = `Use up to ${CAREER_MAX} lines of ${LINE_MAX} characters or fewer.`;
  if (a.bio.length < BIO_MIN) errors.bio = `Write a little more: at least ${BIO_MIN} characters.`;
  else if (a.bio.length > BIO_MAX) errors.bio = `Keep it to ${BIO_MAX} characters.`;
  if (!a.accurate) errors.accurate = "Please confirm the information is accurate.";
  if (!a.agreed) errors.agreed = "Please agree to the Terms of Service and the directory rules.";
  return errors;
}
