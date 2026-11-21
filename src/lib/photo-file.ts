import type { PhotoAsset } from "@/components/ui/Photo";

/** The share-card crop for a photo: src/assets/og/<original file name>.jpg, or the brand illustration. */
export function ogArt(photo?: PhotoAsset) {
  if (!photo) return "brand";
  const file = photo.src.src.split("/").pop() ?? "";
  return file.split(".")[0] || "brand";
}
