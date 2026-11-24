/**
 * Facts checked 2026-11-24: Study in the States "Eligible CIP codes" page, the ICE STEM list PDF and
 * the Federal Register list updates of July 12, 2023 and July 23, 2024 (see opt-sources.ts).
 * No newer list update was found in the Federal Register on 2026-11-24.
 */
import cover from "@/assets/blog/stem-degree-eligible-cip-code.jpg";
import type { BlogPost } from "../types";
import { OPT_SRC } from "./opt-sources";

export const stemDegreeEligibleCipCode: BlogPost = {
  slug: "stem-degree-eligible-cip-code",
  title: "Is my degree STEM eligible? How to check your CIP code for STEM OPT",
  seoTitle: "Is My Degree STEM OPT Eligible? Check Your CIP Code",
  description:
    "Whether your degree qualifies for STEM OPT depends on its CIP code, not its name. Find your code, check the official list and see the latest additions.",
  topic: "Students & OPT",
  published: "2026-11-11",
  author: "kiran",
  updated: "2026-11-24",
  cover: {
    src: cover,
    alt: "A student holding a diploma scroll stands beside a large grid of category tiles, one highlighted with a check, with science and engineering icons around it",
  },
  answer:
    "Your degree qualifies for STEM OPT if its CIP code is on the Department of Homeland Security's STEM Designated Degree Program List. The CIP code, not the degree's name, is what counts, and it's printed on your Form I-20. All fields in engineering (14), biological sciences (26), mathematics (27) and physical sciences (40) are included, plus specific related fields. The last update we found added Environmental/Natural Resource Economics in July 2024.",
  takeaways: [
    "Eligibility is decided by your program's CIP code, which is on your Form I-20.",
    "Every code in four series counts: engineering (14), biological sciences (26), mathematics (27) and physical sciences (40).",
    "Related fields are added code by code, at the two-, four- or six-digit level.",
    "DHS publishes list changes in the Federal Register. The latest we found was July 23, 2024.",
    "Your degree must be a bachelor's, master's or doctorate from an accredited, SEVP-certified school.",
  ],
  sections: [
    {
      id: "cip-codes",
      heading: "Why the CIP code matters, not the degree name",
      blocks: [
        "The Classification of Instructional Programs (CIP) is the Department of Education's coding system for fields of study. Every program has a six-digit code such as 11.0701 or 52.1301. DHS built its STEM list from CIP codes, so two degrees with similar names can be treated differently if their codes differ.",
        {
          kind: "callout",
          tone: "tip",
          title: "Where to find your code",
          text: "Your program's CIP code is printed on your Form I-20, in the program of study section. If it's wrong, ask your DSO before you apply. The code on record is what's checked.",
        },
      ],
    },
    {
      id: "whats-included",
      heading: "What's on the STEM list",
      blocks: [
        {
          kind: "table",
          caption: "How DHS defines STEM fields",
          head: ["Group", "What's included"],
          rows: [
            ["Engineering (CIP 14)", "Every field in the series"],
            ["Biological and biomedical sciences (CIP 26)", "Every field in the series"],
            ["Mathematics and statistics (CIP 27)", "Every field in the series"],
            ["Physical sciences (CIP 40)", "Every field in the series"],
            ["Related fields", "Listed individually, for example many computer science, engineering technology and data fields"],
          ],
          note: "Source: Study in the States, [Eligible CIP codes for the STEM OPT extension](https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/eligible-cip-codes-for-the-stem-opt-extension). The full list is the [official STEM Designated Degree Program List](https://www.ice.gov/doclib/sevis/pdf/stemList2024.pdf).",
        },
        "DHS says related fields generally involve research, innovation or development of new technologies using engineering, mathematics, computer science or the natural sciences.",
      ],
    },
    {
      id: "recent-additions",
      heading: "Fields added recently",
      blocks: [
        {
          kind: "table",
          caption: "Recent additions to the STEM list",
          head: ["Field", "CIP code", "Added"],
          rows: [
            ["Environmental/Natural Resource Economics", "03.0204", "July 23, 2024"],
            ["Landscape Architecture", "04.0601", "July 12, 2023"],
            ["Institutional Research", "13.0608", "July 12, 2023"],
            ["Mechatronics, Robotics, and Automation Engineering Technology/Technician", "15.0407", "July 12, 2023"],
            ["Composite Materials Technology/Technician", "15.0617", "July 12, 2023"],
            ["Linguistics and Computer Science", "30.4801", "July 12, 2023"],
            ["Developmental and Adolescent Psychology", "42.2710", "July 12, 2023"],
            ["Geospatial Intelligence", "43.0407", "July 12, 2023"],
            ["Demography and Population Studies", "45.0501", "July 12, 2023"],
          ],
          note: "Sources: Federal Register notices of [July 12, 2023](https://www.federalregister.gov/documents/2023/07/12/2023-14807/update-to-the-department-of-homeland-security-stem-designated-degree-program-list) and [July 23, 2024](https://www.federalregister.gov/documents/2024/07/23/2024-16127/update-to-the-department-of-homeland-security-stem-designated-degree-program-list). No codes were removed in 2023.",
        },
      ],
    },
    {
      id: "how-to-check",
      heading: "How to check your degree in five minutes",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Find the CIP code on your I-20", text: "It's a six-digit code in the program of study section." },
            { title: "Check the series", text: "If it starts with 14, 26, 27 or 40, your field is on the list." },
            { title: "Otherwise, search the full list", text: "Look up the exact code in the [official STEM list](https://www.ice.gov/doclib/sevis/pdf/stemList2024.pdf)." },
            { title: "Confirm with your DSO", text: "They make the STEM OPT recommendation and can confirm your code before you plan around it." },
          ],
        },
      ],
    },
    {
      id: "other-rules",
      heading: "Other STEM OPT requirements",
      blocks: [
        [
          "**Degree level:** a bachelor's, master's or doctorate.",
          "**School:** accredited by a Department of Education-recognized accreditor and SEVP-certified when you apply.",
          "**Earlier degree:** you may be able to use a previous STEM degree from a U.S. school in some cases. Ask your DSO.",
          "**Employer:** enrolled in E-Verify, with a signed Form I-983 training plan.",
        ],
        "The full process is in our [STEM OPT extension guide](/blog/stem-opt-extension-2026).",
      ],
    },
  ],
  faq: [
    {
      q: "How do I know if my degree is STEM eligible?",
      a: "Find the CIP code on your Form I-20 and check it against DHS's STEM Designated Degree Program List. Codes starting with 14, 26, 27 or 40 always qualify.",
    },
    {
      q: "Where is the CIP code on my I-20?",
      a: "In the program of study section of your Form I-20. Ask your DSO if you can't find it or think it's wrong.",
    },
    {
      q: "Is computer science STEM OPT eligible?",
      a: "Computer science fields are among the related fields on the list. Check your exact six-digit CIP code on the official list to be sure.",
    },
    {
      q: "Is an MBA STEM eligible?",
      a: "It depends on the program's CIP code, not the degree name. Some business programs use a STEM-listed code (for example, in analytics), and others don't.",
    },
    {
      q: "When was the STEM list last updated?",
      a: "The latest Federal Register update we found was July 23, 2024, which added Environmental/Natural Resource Economics (03.0204).",
    },
  ],
  sources: [OPT_SRC.stemCip, OPT_SRC.stemList, OPT_SRC.stemUpdate2024, OPT_SRC.stemUpdate2023, OPT_SRC.stem],
  links: [
    { href: "/blog/stem-opt-extension-2026", label: "STEM OPT extension in 2026" },
    { href: "/blog/opt-processing-time-2026", label: "OPT processing time in 2026" },
    { href: "/forms/i-765", label: "Form I-765: apply for a work permit" },
    { href: "/blog/opt-unemployment-90-days", label: "The OPT 90-day unemployment rule" },
  ],
};
