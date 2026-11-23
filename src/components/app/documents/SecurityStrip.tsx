import Link from "next/link";
import { KeyRound, ShieldCheck, Timer } from "lucide-react";
import { BrandLogo, type BrandMark } from "@/components/ui/BrandLogo";
import { appCard, appLink } from "@/lib/ui";

/*
 * Only what's true today: the site sits behind Cloudflare (its proxy and nameservers), serves
 * HTTPS with a Let's Encrypt certificate and HSTS, and keeps files in private, encrypted
 * PostgreSQL-backed storage that row-level security opens only to the owner after they unlock.
 * Check before adding a claim here.
 */
const PARTNERS: { mark: BrandMark; title: string; text: string }[] = [
  { mark: "cloudflare", title: "Cloudflare protection", text: "Blocks attacks and bots" },
  { mark: "letsencrypt", title: "SSL encrypted", text: "Every page uses HTTPS" },
  { mark: "postgresql", title: "Encrypted storage", text: "Your files open only for you" },
];

const FACTS = [
  { icon: KeyRound, text: "Passcode stored scrambled" },
  { icon: ShieldCheck, text: "Locks after 3 wrong tries" },
  { icon: Timer, text: "File links expire in 5 minutes" },
];

/** How Documents is kept safe, with the real logos of the services behind it. */
export function SecurityStrip() {
  return (
    <section aria-labelledby="security-title" className="enter enter-delay-2 mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="security-title" className="text-small font-semibold text-midnight">
          How we keep your documents safe
        </h2>
        <Link href="/security" className={`${appLink} text-small`}>
          Security details
        </Link>
      </div>

      <ul className="stagger mt-3 grid gap-2 sm:grid-cols-3 sm:gap-3 [--stagger-base:300ms]">
        {PARTNERS.map((p) => (
          <li
            key={p.mark}
            className={`${appCard} group flex items-center gap-3 p-3 transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-blue/30 motion-reduce:hover:translate-y-0`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white">
              <BrandLogo mark={p.mark} className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="text-small font-semibold text-midnight">{p.title}</p>
              <p className="text-caption text-slate">{p.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-caption text-slate">
        {FACTS.map((f) => (
          <li key={f.text} className="inline-flex items-center gap-1.5">
            <f.icon aria-hidden className="size-3.5 text-teal" />
            {f.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
