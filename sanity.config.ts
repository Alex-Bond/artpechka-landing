import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

/**
 * Studio config, read by @sanity/astro to mount the Studio at /studio (the
 * integration owns basePath, so it isn't set here). Also still used by
 * `sanity dev` / `sanity deploy` via sanity.cli.ts.
 *
 * projectId and dataset are hardcoded on purpose: this file gets bundled for
 * the browser, where process.env doesn't exist. The dataset is public, so
 * neither value is a secret.
 */
export default defineConfig({
  name: 'default',
  title: 'Artem Pichak',

  projectId: 'ntn8xrgb',
  dataset: 'production',

  plugins: [structureTool({ structure }), visionTool()],

  schema: { types: schemaTypes },
})
