import type { CSSProperties } from "react";

type Props = {
  /** media base name, e.g. "overview-day" → /media/overview-day-{960,1600,2560,3840}.avif (+ .webp fallback) */
  name: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  /** use the 9:16 crop on narrow/tall viewports (only exists for hero-style images) */
  portrait?: boolean;
  priority?: boolean;
  draggable?: boolean;
};

/**
 * Responsive picture from the pre-rendered media set (see /public/media), cut from the 4K game captures.
 * AVIF (full 4:4:4 colour, up to 3840w) first; the WebP set is only a fallback for browsers without AVIF.
 * Next/Image is bypassed on purpose so the site can be a fully static export.
 */
export default function Img({ name, alt, className, style, sizes = "100vw", portrait, priority, draggable = false }: Props) {
  const avifSet = `/media/${name}-960.avif 960w, /media/${name}-1600.avif 1600w, /media/${name}-2560.avif 2560w, /media/${name}-3840.avif 3840w`;
  const webpSet = `/media/${name}-960.webp 960w, /media/${name}-1600.webp 1600w, /media/${name}-2560.webp 2560w`;
  return (
    <picture>
      {portrait && <source media="(max-aspect-ratio: 4/5)" type="image/avif" srcSet={`/media/${name}-portrait.avif`} />}
      {portrait && <source media="(max-aspect-ratio: 4/5)" type="image/webp" srcSet={`/media/${name}-portrait.webp`} />}
      <source type="image/avif" srcSet={avifSet} sizes={sizes} />
      <img
        src={`/media/${name}-1600.webp`}
        srcSet={webpSet}
        sizes={sizes}
        alt={alt}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        draggable={draggable}
      />
    </picture>
  );
}
