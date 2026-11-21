#!/usr/bin/env node
/**
 * Generate an image with Google's Gemini image model.
 *
 *   node --env-file=.env.local scripts/generate-image.mjs "<prompt>" out.png [aspect] [model]
 *
 * aspect: 1:1, 3:2, 4:3, 16:9, 21:9 … (default 1:1)
 * model:  default gemini-3-pro-image
 * Needs GOOGLE_API_KEY in .env.local (never commit it).
 */
import { writeFile } from "node:fs/promises";

const [prompt, out, aspectRatio = "1:1", model = "gemini-3-pro-image"] = process.argv.slice(2);
const key = process.env.GOOGLE_API_KEY;
if (!prompt || !out) {
  console.error('Usage: node --env-file=.env.local scripts/generate-image.mjs "<prompt>" out.png [aspect] [model]');
  process.exit(1);
}
if (!key) {
  console.error("GOOGLE_API_KEY is missing. Add it to .env.local.");
  process.exit(1);
}

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-goog-api-key": key },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio } },
  }),
});
const json = await res.json();
if (!res.ok) {
  console.error(`Error ${res.status}:`, json.error?.message ?? json);
  process.exit(1);
}
const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
if (!part) {
  console.error("No image returned:", JSON.stringify(json).slice(0, 500));
  process.exit(1);
}
await writeFile(out, Buffer.from(part.inlineData.data, "base64"));
console.log(`Saved ${out} (${part.inlineData.mimeType})`);
