/** A swappable site photo (see data/media.ts): the store's upload, else the slot default, else a branded placeholder. */

import { ReMark } from "@/components/BrandMark";
import { mediaSlotIndex, type MediaSlotKey } from "@/data/media";
import { useCatalog } from "@/contexts/CatalogContext";

export function useSiteMedia(key: MediaSlotKey) {
  const { getMedia } = useCatalog();
  const slot = mediaSlotIndex.get(key);
  const uploaded = getMedia(key);
  const photo = uploaded ? { url: uploaded.url, urlSmall: uploaded.urlSmall } : slot?.fallback ?? null;
  const caption = uploaded?.caption || slot?.caption || "";
  return { photo, caption, alt: uploaded?.alt || caption };
}

type Props = { slot: MediaSlotKey; sizes: string; eager?: boolean };

export function SiteImage({ slot, sizes, eager = false }: Props) {
  const { photo, alt, caption } = useSiteMedia(slot);
  if (!photo) {
    return (
      <div className="product-fallback site-fallback" role="img" aria-label={`${caption} — photo coming soon`}>
        <ReMark className="product-fallback__mark" />
        <span>{caption}</span>
      </div>
    );
  }
  // Uploaded photos are 600 / 1400 px wide; bundled ones 480 / 960 px.
  const uploaded = /-1400\.\w+$/.test(photo.url);
  const srcSet = photo.urlSmall ? `${photo.urlSmall} ${uploaded ? 600 : 480}w, ${photo.url} ${uploaded ? 1400 : 960}w` : undefined;
  return (
    <img
      src={photo.urlSmall ?? photo.url}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={480}
      height={400}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
    />
  );
}
