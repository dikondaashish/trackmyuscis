/**
 * Search and AI-assistant metadata in one place: page metadata (title, description,
 * canonical, Open Graph, Twitter) and schema.org JSON-LD builders.
 */
import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

export const SITE_NAME = COMPANY.product;
export const SITE_URL = COMPANY.siteUrl;
/** Date the site content was last reviewed. Sitemap lastmod and Article dateModified use it. */
export const CONTENT_UPDATED = "2026-11-20";

export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path === "/" ? "" : path}`);

type PageMetaInput = {
  /** Title before " | TrackMyUSCIS". Lead with the words people search for. */
  title: string;
  /** 120–160 characters, plain words, says what the page gives you. Longer text is cut in search results. */
  description: string;
  path: string;
  type?: "website" | "article";
  /** Use for pages that should not appear in search (sign-in). */
  noindex?: boolean;
  /** true on the homepage: the title is used as-is, without the site-name suffix. */
  absoluteTitle?: boolean;
};

/** Google cuts titles at about 60 characters, so the site name is added only when it fits. */
const TITLE_MAX = 60;

export function pageMetadata({ title, description, path, type = "website", noindex, absoluteTitle }: PageMetaInput): Metadata {
  const withName = `${title} | ${SITE_NAME}`;
  const fullTitle = absoluteTitle || withName.length > TITLE_MAX ? title : withName;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: SITE_NAME, type, locale: "en_US" },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ------------------------------------------------------------ JSON-LD */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: abs("/brand/logo-app.png"),
  email: COMPANY.email.support,
  description: "Independent immigration case-tracking platform. Not affiliated with USCIS or the U.S. government.",
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: COMPANY.email.support, availableLanguage: "English" },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": SITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: { "@id": ORG_ID },
};

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function webPageSchema({
  name,
  description,
  path,
  type = "WebPage",
  speakable,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  type?: string;
  /** ISO date the page content was last checked. */
  dateModified?: string;
  /** CSS selectors of the parts a voice assistant should read aloud. */
  speakable?: string[];
}) {
  return {
    "@type": type,
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    ...(dateModified ? { dateModified } : {}),
    ...(speakable ? { speakable: { "@type": "SpeakableSpecification", cssSelector: speakable } } : {}),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

export function itemListSchema(name: string, items: { name: string; path: string }[]) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
  };
}

/** "2026-11-20" → "November 20, 2026", fixed to UTC so server and browser agree. */
export const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function articleSchema({ headline, description, path, image }: { headline: string; description: string; path: string; image?: string }) {
  return {
    "@type": "Article",
    headline,
    description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    ...(image ? { image: abs(image) } : {}),
    datePublished: CONTENT_UPDATED,
    dateModified: CONTENT_UPDATED,
    inLanguage: "en-US",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export const webApplicationSchema = {
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires a modern web browser",
  description:
    "Free tool that checks a USCIS receipt number's format and issuing office, with plain-English case status meanings and links to official processing times.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": ORG_ID },
};

export function definedTermSetSchema(name: string, path: string, terms: { name: string; description: string }[]) {
  return {
    "@type": "DefinedTermSet",
    name,
    url: abs(path),
    hasDefinedTerm: terms.map((t) => ({ "@type": "DefinedTerm", name: t.name, description: t.description, inDefinedTermSet: abs(path) })),
  };
}
