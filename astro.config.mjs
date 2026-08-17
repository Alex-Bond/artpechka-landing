import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sanity from '@sanity/astro'
import { loadEnv } from 'vite'

/**
 * `loadEnv` rather than `process.env` because astro.config runs before Astro's
 * own env loading, and the project id lives in the gitignored .env.local.
 * The dataset is public, so the fallbacks are safe to commit.
 */
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

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
  ],
})
