import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { toBlogCard } from "@/lib/blog/card";
import { JsonLd } from "@/components/JsonLd";
import { BLOG_POSTS, BLOG_TOPICS } from "@/lib/blog";
import { abs, breadcrumbSchema, itemListSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { container, focusRing } from "@/lib/ui";

export const metadata = pageMetadata({
  title: "USCIS and Green Card Blog: Plain-English Updates",
  description:
    "Plain-English posts on the Visa Bulletin, green card renewal, I-140 and other USCIS cases, each checked against official government sources.",
  path: "/blog",
});

const card = toBlogCard;

/**
 * The blog: the newest post as a large feature, then every other post with topic chips and
 * search. Stripe- and Linear-style restraint: one feature, a clean grid, no sidebars.
 */
export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;
  const f = card(featured);

  return (
    <>
      <JsonLd
        data={[
          {
            ...webPageSchema({
              name: "TrackMyUSCIS blog",
              description: "Plain-English posts on USCIS cases, checked against official sources.",
              path: "/blog",
              type: "CollectionPage",
            }),
          },
          { "@type": "Blog", "@id": `${abs("/blog")}#blog`, name: "TrackMyUSCIS blog", url: abs("/blog"), inLanguage: "en-US" },
          itemListSchema(
            "Blog posts",
            BLOG_POSTS.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })),
          ),
          breadcrumbSchema([{ name: "Blog", path: "/blog" }]),
        ]}
      />

      <section className="border-b border-border bg-white">
        <div className={`${container} enter pt-10 pb-12 sm:pt-14 sm:pb-16`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-h1 text-midnight">Blog</h1>
              <p className="mt-3 max-w-xl text-lead text-slate">
                Plain-English updates on USCIS cases, each checked against official sources.
              </p>
            </div>
            <a
              href="/blog/feed.xml"
              className={`inline-flex min-h-11 items-center gap-1.5 rounded font-semibold text-blue ${focusRing}`}
            >
              <Rss aria-hidden className="size-4" />
              RSS feed
            </a>
          </div>

          {/* The newest post, large. */}
          <article className="group relative mt-10 grid items-center gap-6 overflow-hidden rounded-2xl border border-border bg-cloud lg:grid-cols-[1.15fr_1fr] lg:gap-0">
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[22rem]">
              <Image
                src={f.cover.src}
                alt={f.cover.alt}
                fill
                preload
                placeholder="blur"
                sizes="(min-width: 1024px) 680px, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
            <div className="px-6 pb-8 sm:px-8 lg:py-10 lg:pr-10 lg:pl-12">
              <p className="text-small font-semibold text-blue">
                Latest · {f.topic}
              </p>
              <h2 className="mt-2 text-h3 text-midnight">
                <Link
                  href={`/blog/${f.slug}`}
                  className={`rounded after:absolute after:inset-0 after:content-[''] group-hover:text-blue ${focusRing}`}
                >
                  {f.title}
                </Link>
              </h2>
              <p className="mt-3 text-body text-slate">{f.description}</p>
              <p className="mt-5 text-small text-slate tabular-nums">
                <span className="font-medium text-midnight">{f.author}</span> · {f.date} · {f.minutes} min read
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-small font-semibold text-blue">
                Read the post
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </article>
        </div>
      </section>

      {rest.length > 0 && (
        <section className="bg-cloud py-14 sm:py-20">
          <div className={container}>
            <h2 className="sr-only">More posts</h2>
            <BlogIndex
              topics={BLOG_TOPICS}
              posts={rest.map((p) => ({
                ...card(p),
                text: [p.title, p.description, p.topic, ...p.sections.map((s) => s.heading)].join(" ").toLowerCase(),
              }))}
            />
          </div>
        </section>
      )}
    </>
  );
}
