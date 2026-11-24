import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { focusRing } from "@/lib/ui";

export type BlogCardData = {
  slug: string;
  title: string;
  description: string;
  topic: string;
  date: string;
  minutes: number;
  cover: { src: StaticImageData; alt: string };
};

/** A post in a list: 16:10 cover, topic, title, one line, date and reading time. The whole card is the link. */
export function BlogCard({ post, priority = false }: { post: BlogCardData; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-ice">
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          placeholder="blur"
          preload={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <p className="mt-4 text-small font-semibold text-blue">{post.topic}</p>
      <h3 className="mt-1 text-title text-midnight">
        <Link
          href={`/blog/${post.slug}`}
          className={`rounded after:absolute after:inset-0 after:content-[''] group-hover:text-blue ${focusRing}`}
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-small text-slate">{post.description}</p>
      <p className="mt-3 text-small text-slate tabular-nums">
        {post.date} · {post.minutes} min read
      </p>
    </article>
  );
}
