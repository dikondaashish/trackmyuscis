import { buildSearchIndex } from "@/lib/search";

/**
 * The site search index as JSON, built at deploy time from the same content as the pages.
 * The header's quick search loads it the first time someone opens search, so it never
 * weighs down ordinary page loads. Queries stay in the browser and are never sent here.
 */
export function GET() {
  return Response.json(buildSearchIndex());
}
