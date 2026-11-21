import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { COMPANY } from "@/lib/company";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"], // optical sizing: large headings render in Inter Display
});

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.siteUrl),
  title: { default: "TrackMyUSCIS", template: "%s | TrackMyUSCIS" },
  description:
    "Free and independent: check your USCIS receipt number, see what each case status means in plain English and find the official processing time for your form.",
  applicationName: "TrackMyUSCIS",
  publisher: "TrackMyUSCIS",
  openGraph: { siteName: "TrackMyUSCIS", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <a
          href="#main"
          className="skip-link rounded-[10px] bg-midnight px-4 py-3 text-small font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
