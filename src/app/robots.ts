import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/company";

/**
 * Search engines and AI assistants are named and welcomed explicitly: people find us through
 * Google and through chatbots. Nothing public is blocked; pages that shouldn't be in search
 * (sign-in) use a noindex tag instead, which avoids "indexed, though blocked by robots.txt".
 */
const CRAWLERS = [
  // Search engines
  "Googlebot", "Googlebot-Image", "Bingbot", "DuckDuckBot", "Applebot", "YandexBot", "Slurp",
  // AI assistants and AI search
  "Google-Extended", "GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-User", "Claude-SearchBot",
  "anthropic-ai", "PerplexityBot", "Perplexity-User", "Applebot-Extended", "CopilotBot", "meta-externalagent",
  "MistralBot", "cohere-ai", "YouBot", "GrokBot", "xAI-Grok",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: CRAWLERS, allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${COMPANY.siteUrl}/sitemap.xml`,
    host: COMPANY.siteUrl,
  };
}
