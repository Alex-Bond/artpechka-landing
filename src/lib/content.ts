import { sanityClient } from 'sanity:client'
import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImageAsset {
  _id: string
  url: string
  metadata: {
    dimensions: { width: number; height: number; aspectRatio: number }
    lqip: string
  }
}

export interface ProjectImage {
  alt: string | null
  asset: SanityImageAsset | null
}

export interface ProjectVideo {
  url: string
  label: string | null
}

export interface Credit {
  role: string
  name: string
}

export interface Project {
  _id: string
  title: string
  slug: string
  client: string | null
  year: number | null
  category: string | null
  description: string
  services: string[]
  featured: boolean
  publishedToSearch: boolean
  body: PortableTextBlock[] | null
  credits: Credit[] | null
  images: ProjectImage[]
  videos: ProjectVideo[] | null
  seo: {
    metaTitle: string | null
    metaDescription: string | null
    shareImage: { asset: SanityImageAsset | null } | null
  } | null
}

export interface Category {
  _id: string
  title: string
  slug: string
}

const IMAGE_FRAGMENT = `{
  alt,
  asset->{ _id, url, metadata { dimensions, lqip } }
}`

const PROJECT_FRAGMENT = `{
  _id, title, "slug": slug.current, client, year, description, services, featured,
  publishedToSearch, body, credits,
  "category": category->title,
  images[]${IMAGE_FRAGMENT},
  videos[]{ url, label },
  seo { metaTitle, metaDescription, shareImage { asset->{ _id, url, metadata { dimensions, lqip } } } }
}`

/** Every project, in the order Artem dragged them into in the Studio. */
export async function getProjects(): Promise<Project[]> {
  return sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)] | order(orderRank) ${PROJECT_FRAGMENT}`,
  )
}

/** Filter buttons, in Studio order. Only categories that have projects. */
export async function getCategories(): Promise<Category[]> {
  return sanityClient.fetch(
    `*[_type == "category" && count(*[_type == "project" && references(^._id)]) > 0]
      | order(orderRank) { _id, title, "slug": slug.current }`,
  )
}

/**
 * Descriptions are allowed up to 280 characters because they read as card copy;
 * a meta description gets cut off around 160 in the SERP, so trim on a word.
 */
export function metaDescription(text: string, limit = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return clean
  const cut = clean.slice(0, limit)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:—-]$/, '')}…`
}

/**
 * The cover still is simply the first one — ordering the array in the Studio is
 * how the cover gets chosen, which is why the old `thumbnail` field is gone.
 */
export function coverImage(project: Project): ProjectImage | null {
  return project.images?.find((image) => image.asset) ?? null
}
