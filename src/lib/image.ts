import imageUrlBuilder from '@sanity/image-url'
import type { ProjectImage, SanityImageAsset } from './content'

/**
 * Public values — the dataset is public and these end up in every image URL.
 * Kept here rather than read from env so islands can build URLs too.
 */
export const SANITY_PROJECT_ID = 'ntn8xrgb'
export const SANITY_DATASET = 'production'
export const SANITY_CDN = 'https://cdn.sanity.io'

const builder = imageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET })

export interface ResponsiveImage {
  src: string
  srcset: string
  sizes: string
  width: number
  height: number
  lqip: string
  alt: string
}

const DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920]

/**
 * `auto=format` lets Sanity's CDN negotiate AVIF/WebP per browser, so one
 * srcset covers every format. Width/height come from the asset metadata, which
 * is what stops the grid reflowing as stills load.
 */
export function responsiveImage(
  image: ProjectImage | null | undefined,
  options: { sizes: string; widths?: number[]; alt?: string; quality?: number } = {
    sizes: '100vw',
  },
): ResponsiveImage | null {
  const asset = image?.asset
  if (!asset) return null

  const { widths = DEFAULT_WIDTHS, sizes, quality = 80 } = options
  const { width, height } = asset.metadata.dimensions

  // Never upscale: a 900px-wide still asked for at 1920 just wastes bytes.
  const usable = widths.filter((w) => w <= width)
  if (usable.length === 0 || usable[usable.length - 1] < width) usable.push(width)

  const url = (w: number) =>
    builder.image(asset._id).width(w).auto('format').quality(quality).url()

  return {
    src: url(usable[usable.length - 1]),
    srcset: usable.map((w) => `${url(w)} ${w}w`).join(', '),
    sizes,
    width,
    height,
    lqip: asset.metadata.lqip,
    alt: image?.alt || options.alt || '',
  }
}

/** A fixed-size crop, for og:image where the dimensions are dictated. */
export function shareImageUrl(
  asset: SanityImageAsset | null | undefined,
  width = 1200,
  height = 630,
): string | null {
  if (!asset) return null
  return builder.image(asset._id).width(width).height(height).fit('crop').auto('format').url()
}
