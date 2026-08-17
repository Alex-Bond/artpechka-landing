export interface EmbeddableVideo {
  /** Original watch URL, used as the JSON-LD `url` and the fallback link. */
  url: string
  label: string
  embedUrl: string | null
  provider: 'youtube' | 'vimeo' | null
}

const YOUTUBE = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/

/**
 * The schema only accepts YouTube and Vimeo links, so these two patterns cover
 * everything. `provider: null` means the link still renders — as a link.
 */
export function embeddable(video: { url: string; label?: string | null }, index = 0): EmbeddableVideo {
  const label = video.label?.trim() || (index === 0 ? 'Play video' : `Video ${index + 1}`)

  const youtube = video.url.match(YOUTUBE)
  if (youtube) {
    return {
      url: video.url,
      label,
      // youtube-nocookie keeps the pre-consent tracking off a page that has no
      // cookie banner.
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0`,
      provider: 'youtube',
    }
  }

  const vimeo = video.url.match(VIMEO)
  if (vimeo) {
    return {
      url: video.url,
      label,
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`,
      provider: 'vimeo',
    }
  }

  return { url: video.url, label, embedUrl: null, provider: null }
}
