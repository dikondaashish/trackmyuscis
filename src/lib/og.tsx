/**
 * Social share card (1200 × 630), used by every opengraph-image route.
 * Left: logo, title, one line. Right: the page's photo or the brand illustration.
 * Rendered at build time with Inter; colours come from the brand palette.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { COMPANY } from "@/lib/company";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";


/** `art` is a file in src/assets/og (photo crops share the photo's file name; "brand" is the illustration). */
export function ogImage({ title, description, art = "brand" }: { title: string; description?: string; art?: string }) {
  // Synchronous reads keep the image prerenderable at build time (async I/O would defer it to request time).
  // Each path is scoped to its own folder so the bundler traces only those files.
  const regular = readFileSync(join(process.cwd(), "src/assets/fonts/Inter-400.ttf"));
  const semibold = readFileSync(join(process.cwd(), "src/assets/fonts/Inter-600.ttf"));
  const logo = readFileSync(join(process.cwd(), "public/brand/logo-primary.svg"));
  const picture = readFileSync(join(process.cwd(), "src/assets/og", `${art.replace(/[^a-z0-9-]/gi, "")}.jpg`));
  const titleSize = title.length > 60 ? 48 : title.length > 36 ? 56 : 64;
  const line = description && description.length > 110 ? `${description.slice(0, 107).replace(/\s+\S*$/, "")}…` : description;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#FFFFFF", fontFamily: "Inter" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 600, padding: "56px 56px 52px", borderRight: "1px solid #DDE6F0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
          <img src={`data:image/svg+xml;base64,${logo.toString("base64")}`} alt="" width={241} height={40} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto" }}>
            <div style={{ fontSize: titleSize, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.022em", color: "#10223D" }}>
              {title}
            </div>
            {line && <div style={{ marginTop: 20, fontSize: 24, lineHeight: 1.45, color: "#516176", display: "flex" }}>{line}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 20, color: "#516176" }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#087F79", marginRight: 12 }} />
            {COMPANY.domain}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
        <img src={`data:image/jpeg;base64,${picture.toString("base64")}`} alt="" width={600} height={630} style={{ objectFit: "cover" }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
