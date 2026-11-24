import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    "Free and independent: track your USCIS case status in a free account, check a receipt number, and read what each status and processing time means.",
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
        {children}
      </body>
    </html>
  );
}
