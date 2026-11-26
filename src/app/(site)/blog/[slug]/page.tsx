import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Info, ShieldCheck } from "lucide-react";
import { BlogBlocks } from "@/components/blog/BlogBlocks";
import { BlogCard } from "@/components/blog/BlogCard";
import { toBlogCard } from "@/lib/blog/card";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { JsonLd } from "@/components/JsonLd";
import { OfficialSources } from "@/components/OfficialSources";
import { LinkRows } from "@/components/ui/LinkRows";
import { RichText } from "@/components/ui/RichText";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { AUTHORS, BLOG_POSTS, getPost, readingMinutes, relatedPosts } from "@/lib/blog";
import { abs, blogPostingSchema, breadcrumbSchema, faqSchema, longDate, pageMetadata, webPageSchema } from "@/lib/seo";
import { TRACK_CASE_HREF } from "@/lib/site";
import { container, docContainer, focusRing } from "@/lib/ui";

/** Every post is prerendered; unknown slugs return a real 404. */
export const instant = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  const meta = pageMetadata({ title: p.seoTitle ?? p.title, description: p.description, path: `/blog/${p.slug}`, type: "article" });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: p.published, modifiedTime: p.updated, section: p.topic },
  };
}

/**
 * One blog post. Answer first (for readers and AI assistants), then key takeaways, the
 * sections, a call to track your case, FAQ, official sources and what to read next.
 * Desktop keeps "On this page" beside the article; a bar at the top shows reading progress.
 */
export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const path = `/blog/${p.slug}`;
  const minutes = readingMinutes(p);
  const toc = p.sections.map((s) => ({ id: s.id, heading: s.heading }));
  const more = relatedPosts(p).map(toBlogCard);
  const author = AUTHORS[p.author];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: p.title, description: p.description, path, speakable: ["#short-answer"], dateModified: p.updated }),
          blogPostingSchema({
            headline: p.title,
            description: p.description,
            path,
            image: p.cover.src.src,
            published: p.published,
            modified: p.updated,
            section: p.topic,
            author: author.name,
            wordCount: minutes * 220,
          }),
          faqSchema(p.faq),
          breadcrumbSchema([
            { name: "Blog", path: "/blog" },
            { name: p.title, path },
          ]),
        ]}
      />
      <div aria-hidden className="reading-progress fixed inset-x-0 top-0 z-[60] h-[3px] bg-blue" />

      <article>
        <header className="border-b border-border bg-white">
          <div className={`${docContainer} enter pt-8 pb-10 sm:pt-12 sm:pb-12`}>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-small text-slate">
              <Link href="/blog" className={`inline-flex min-h-11 items-center gap-1.5 rounded font-medium hover:text-blue ${focusRing}`}>
                <ArrowLeft aria-hidden className="size-4" />
                Blog
              </Link>
              <span aria-hidden>/</span>
              <span>{p.topic}</span>
            </nav>
            <h1 className="mt-3 max-w-3xl text-h1 text-midnight">{p.title}</h1>
            <p className="mt-4 max-w-2xl text-lead text-slate">{p.description}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue"
                >
                  {author.initials}
                </span>
                <div className="text-small">
                  <p className="font-semibold text-midnight">By {author.name}</p>
                  <p className="text-slate tabular-nums">
                    <time dateTime={p.published}>{longDate(p.published)}</time>
                    {p.updated !== p.published && (
                      <>
                        {" "}· Updated <time dateTime={p.updated}>{longDate(p.updated)}</time>
                      </>
                    )}{" "}
                    · {minutes} min read
                  </p>
                </div>
              </div>
              <ShareLinks compact url={abs(path)} title={p.title} />
            </div>
          </div>
          <div className={`${container} pb-10 sm:pb-12`}>
            <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl border border-border bg-ice">
              <Image
                src={p.cover.src}
                alt={p.cover.alt}
                fill
                preload
                placeholder="blur"
                sizes="(min-width: 1088px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </header>

        <div className="bg-cloud">
          <div className={`${docContainer} grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:gap-14`}>
            <div className="min-w-0">
              {/* Phones and tablets: the contents list folds away above the article. */}
              <details className="group mb-8 rounded-xl border border-border bg-white lg:hidden">
                <summary className={`flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-body font-semibold text-midnight ${focusRing}`}>
                  On this page
                  <ChevronDown aria-hidden className="size-4 text-slate transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <ol className="border-t border-border px-4 py-2">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className={`flex min-h-11 items-center rounded text-small text-slate hover:text-blue ${focusRing}`}>
                        {t.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>

              <div id="short-answer" className="rounded-2xl border border-blue/15 bg-ice p-5 sm:p-7">
                <p className="text-small font-semibold text-blue">The short answer</p>
                <p className="mt-2 text-lead text-midnight">{p.answer}</p>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-white p-5 sm:p-7">
                <h2 className="text-title text-midnight">Key takeaways</h2>
                <ul className="mt-4 space-y-3">
                  {p.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 text-body text-slate">
                      <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-teal" />
                      <span>
                        <RichText text={t} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12 space-y-14">
                {p.sections.map((s) => (
                  <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="jump-target scroll-mt-28">
                    <h2 id={`${s.id}-title`} className="text-h3 text-midnight">
                      {s.heading}
                    </h2>
                    <div className="mt-5">
                      <BlogBlocks blocks={s.blocks} />
                    </div>
                  </section>
                ))}
              </div>

              <TrackCta />

              <section aria-labelledby="faq-title" className="mt-14">
                <h2 id="faq-title" className="text-h3 text-midnight">
                  Frequently asked questions
                </h2>
                <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-white">
                  {p.faq.map((f) => (
                    <details key={f.q} className="group">
                      <summary
                        className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-body font-semibold text-midnight ${focusRing}`}
                      >
                        {f.q}
                        <ChevronDown aria-hidden className="size-4 shrink-0 text-slate transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <p className="px-5 pb-5 text-body text-slate">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              <div className="mt-14 rounded-2xl border border-border bg-white p-5 sm:p-7">
                <p className="flex items-center gap-2 text-small font-semibold text-teal">
                  <ShieldCheck aria-hidden className="size-4" />
                  Checked against official sources on {longDate(p.updated)}
                </p>
                <OfficialSources sources={p.sources} className="mt-4" />
              </div>

              <section aria-labelledby="share-title" className="mt-14 rounded-2xl border border-border bg-white p-5 sm:p-7">
                <h2 id="share-title" className="text-title text-midnight">
                  Share this post
                </h2>
                <p className="mt-1 text-body text-slate">Know someone waiting on USCIS? Send it to them.</p>
                <div className="mt-4">
                  <ShareLinks url={abs(path)} title={p.title} />
                </div>
              </section>

              <section aria-labelledby="next-title" className="mt-14">
                <h2 id="next-title" className="text-h3 text-midnight">
                  Read next on TrackMyUSCIS
                </h2>
                <LinkRows compact className="mt-5" items={p.links.map((l) => ({ href: l.href, title: l.label }))} />
              </section>

              <p className="mt-10 flex items-start gap-2 text-small text-slate">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                General information, not legal advice. TrackMyUSCIS is independent and not affiliated with USCIS or the U.S.
                government. Rules, dates and fees change, so confirm with the official sources or a licensed immigration attorney
                before you act.
              </p>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents items={toc} />
                <Link
                  href={TRACK_CASE_HREF}
                  className={`group mt-8 block rounded-xl border border-border bg-white p-4 transition-colors duration-200 hover:border-blue/50 ${focusRing}`}
                >
                  <p className="text-small font-semibold text-midnight">Waiting on USCIS?</p>
                  <p className="mt-1 text-small text-slate">Check your receipt number and see what your status means.</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-small font-semibold text-blue">
                    Track your case
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-title" className="border-t border-border bg-white py-16 sm:py-20">
          <div className={container}>
            <div className="flex items-end justify-between gap-4">
              <h2 id="more-title" className="text-h2 text-midnight">
                More from the blog
              </h2>
              <Link href="/blog" className={`hidden min-h-11 items-center gap-1.5 rounded font-semibold text-blue sm:inline-flex ${focusRing}`}>
                All posts
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((m) => (
                <BlogCard key={m.slug} post={m} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** The one call to action in a post: track your own case. */
function TrackCta() {
  return (
    <div className="mt-14 overflow-hidden rounded-2xl bg-midnight p-6 sm:p-8">
      <p className="text-small font-semibold text-ice/80">Free case tracker</p>
      <p className="mt-2 text-h3 text-white">Know what your USCIS status means</p>
      <p className="mt-2 max-w-lg text-body text-ice/80">
        Enter your receipt number to check it and see, in plain English, what each update means and what usually comes next.
      </p>
      <Link
        href={TRACK_CASE_HREF}
        className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-5 text-small font-semibold text-midnight transition-colors duration-200 hover:bg-ice focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Track your case
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </div>
  );
}
