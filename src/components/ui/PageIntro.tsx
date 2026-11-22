import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Photo, type PhotoAsset } from "@/components/ui/Photo";
import { container, focusRing, h1, lead } from "@/lib/ui";

/**
 * The top of every inner page: an optional way back, the h1, one line and an optional wide photo.
 * The text sits in `width` (match the page body); the photo always spans the full page container.
 */
export function PageIntro({
  title,
  description,
  back,
  photo,
  width = container,
  children,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  /** A wide banner photo under the text: 4:3 phone, 16:9 tablet, 21:9 desktop. */
  photo?: PhotoAsset;
  /** Container class; pass docContainer or readContainer so the intro lines up with a centred page. */
  width?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-border bg-white">
      <div className="enter pt-8 pb-10 sm:pt-10 sm:pb-14">
        <div className={width}>
          {back && (
            <Link
              href={back.href}
              className={`-ml-1 mb-4 inline-flex min-h-11 items-center gap-1.5 rounded px-1 text-small font-medium text-slate transition-colors duration-200 hover:text-midnight ${focusRing}`}
            >
              <ArrowLeft aria-hidden className="size-4" />
              {back.label}
            </Link>
          )}
          <h1 className={`max-w-3xl ${h1}`}>{title}</h1>
          {description && (
            <p className={`mt-3 max-w-2xl ${lead}`}>{description}</p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
        {photo && (
          <div className={container}>
            <Photo
              photo={photo}
              preload
              sizes="(min-width: 1280px) 1216px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
              className="mt-8 aspect-[4/3] rounded-xl sm:mt-10 sm:aspect-[16/9] lg:aspect-[21/9]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
