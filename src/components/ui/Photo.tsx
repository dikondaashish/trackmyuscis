import Image, { type StaticImageData } from "next/image";

export type PhotoAsset = {
  src: StaticImageData;
  alt: string;
  /** CSS object-position that keeps the subject in frame when cropped. */
  focus?: string;
};

/**
 * The one way to show a photograph: rounded frame, fixed aspect ratio, cover crop,
 * blur-up placeholder, responsive sizes. No captions on or under photos.
 */
export function Photo({
  photo,
  className = "",
  sizes,
  preload = false,
  zoomOnHover = false,
}: {
  photo: PhotoAsset;
  /** Aspect ratio and radius classes, e.g. "aspect-[16/10] rounded-xl". */
  className?: string;
  /** Rendered width hint, e.g. "(min-width: 1024px) 560px, 100vw". */
  sizes: string;
  /** Only for a photo visible on first load. */
  preload?: boolean;
  /** Inside a linked card: zoom 1.03 on the card's hover. */
  zoomOnHover?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-ice ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={preload}
        placeholder="blur"
        style={{ objectPosition: photo.focus ?? "50% 50%" }}
        className={`object-cover ${
          zoomOnHover
            ? "transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
            : ""
        }`}
      />
    </div>
  );
}
