/**
 * Official sources shared by the student and OPT posts. All checked 2026-11-24.
 * Facts behind them (keep in sync when they change):
 * - USCIS processing times: I-765, category (c)(3), Service Center Operations: 80% within 6 months.
 * - Fee calculator: I-765 $520 paper / $470 online; I-907 for OPT and STEM OPT $1,780.
 * - Premium fee alert: I-765 OPT premium went from $1,685 to $1,780 on March 1, 2026.
 * - I-765 page: a Sept 14, 2026 court order postponed the fixed-admission-period rule; USCIS uses the
 *   previous rules and the 08/21/25 edition of Form I-765.
 * - Federal Register: OPT fee proposal (Oct 8, 2026, $70,000 initial / $30,000 subsequent, paid by
 *   schools, comments closed Nov 9, 2026); EAD automatic-extension rule final Oct 14, 2026 (renewal EADs
 *   under 8 CFR 274a.13(d); it doesn't mention STEM OPT).
 */
export const OPT_SRC = {
  times: { label: "USCIS: Check case processing times", href: "https://egov.uscis.gov/processing-times/" },
  opt: {
    label: "USCIS: Optional Practical Training (OPT) for F-1 students",
    href: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students",
  },
  stem: {
    label: "USCIS: Optional Practical Training extension for STEM students",
    href: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
  },
  i765: { label: "USCIS: Form I-765, Application for Employment Authorization", href: "https://www.uscis.gov/i-765" },
  fees: { label: "USCIS: Fee calculator (Form G-1055 fee schedule)", href: "https://www.uscis.gov/feecalculator" },
  premium: {
    label: "USCIS: How do I request premium processing?",
    href: "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",
  },
  premiumFeeAlert: {
    label: "USCIS: USCIS to increase premium processing fees (January 9, 2026)",
    href: "https://www.uscis.gov/newsroom/alerts/uscis-to-increase-premium-processing-fees",
  },
  sevpOpt: {
    label: "Study in the States (DHS): F-1 optional practical training",
    href: "https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/f-1-optional-practical-training-opt",
  },
  unemploymentCounter: {
    label: "Study in the States (DHS): SEVIS unemployment counter",
    href: "https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/unemployment-counter",
  },
  regulation: {
    label: "eCFR: 8 CFR 214.2(f), academic students",
    href: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/section-214.2",
  },
  feeProposal: {
    label: "Federal Register: Optional Practical Training Fees, proposed rule (October 8, 2026)",
    href: "https://www.federalregister.gov/documents/2026/10/08/2026-20660/optional-practical-training-fees",
  },
  fixedAdmissionRule: {
    label: "Federal Register: Fixed time period of admission for students, final rule (July 17, 2026)",
    href: "https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant",
  },
  eadRule: {
    label: "Federal Register: Removal of automatic extensions for certain EADs, final rule (October 14, 2026)",
    href: "https://www.federalregister.gov/documents/2026/10/14/2026-20955/removal-of-automatic-extensions-for-certain-employment-authorization-documents",
  },
};
