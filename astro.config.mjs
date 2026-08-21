import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sanity from '@sanity/astro'
import sitemap from '@astrojs/sitemap'
import { loadEnv } from 'vite'

/**
 * `loadEnv` rather than `process.env` because astro.config runs before Astro's
 * own env loading, and the project id lives in the gitignored .env.local.
 * The dataset is public, so the fallbacks are safe to commit.
 */
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

const PROJECT_ID = env.SANITY_STUDIO_PROJECT_ID || 'ntn8xrgb'
const DATASET = env.SANITY_STUDIO_DATASET || 'production'

/**
 * Slugs Artem has hidden from search, so the sitemap never advertises a page
 * that serves noindex. Read straight from the public API rather than through
 * the integration, because this has to resolve before the config object exists.
 *
 * A failure here must not break the build: an empty list means the sitemap
 * lists everything, and the pages themselves still carry the correct robots
 * meta, so the worst case is a stale entry rather than a wrong instruction.
 */
async function hiddenPaths() {
  const query = encodeURIComponent('*[_type == "project" && hideFromSearch == true].slug.current')
  const url = `https://${PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${DATASET}?query=${query}`
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const { result = [] } = await response.json()
    return new Set(result.map((slug) => `/work/${slug}`))
  } catch (error) {
    console.warn(`[sitemap] could not read hidden projects (${error.message}); listing all pages`)
    return new Set()
  }
}

const hidden = await hiddenPaths()

export default defineConfig({
  site: 'https://artpechka.com',
  output: 'static',
  // Internal links are written without a trailing slash, so canonical URLs and
  // og:url have to agree — otherwise every project page advertises a canonical
  // that differs from the URL everything links to.
  trailingSlash: 'never',
  integrations: [
    sanity({
      projectId: env.SANITY_STUDIO_PROJECT_ID || 'ntn8xrgb',
      dataset: env.SANITY_STUDIO_DATASET || 'production',
      apiVersion: '2025-02-19',
      // Static build: read from the API, not the cache, so a deploy hook
      // triggered a second after publishing still picks up the change.
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react(),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page)
        const path = pathname.replace(/\/$/, '') || '/'
        // The Studio is an app, not content, and hidden projects serve noindex.
        return path !== '/studio' && !hidden.has(path)
      },
    }),
  ],
})
