/**
 * One-off migration: src/data/portfolioData.ts  ->  Sanity
 *
 *   bun run migrate -- --dry-run     inspect what would be written
 *   bun run migrate                  create documents that don't exist yet
 *   bun run migrate -- --overwrite   replace documents that DO exist
 *
 * --overwrite discards Studio edits for every document it touches. Safe before
 * Artem starts editing, destructive afterwards. The default mode never overwrites.
 *
 * Bun loads .env.local automatically. Needs SANITY_STUDIO_PROJECT_ID,
 * SANITY_STUDIO_DATASET and SANITY_WRITE_TOKEN.
 */

import { createClient } from '@sanity/client'
import path from 'node:path'
import { portfolioData } from '../src/data/portfolioData'
import type { PortfolioItemType } from '../src/types'

const ROOT = path.resolve(import.meta.dir, '..')
const IMAGE_DIR = path.join(ROOT, 'public')
const MANIFEST = path.join(ROOT, 'scripts/.sanity-asset-manifest.json')

const DRY_RUN = process.argv.includes('--dry-run')
const OVERWRITE = process.argv.includes('--overwrite')

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'
const TOKEN = process.env.SANITY_WRITE_TOKEN

/** Six projects that span the range, instead of the first six in array order. */
const FEATURED = new Set([
  'Police: we are the Police',      // Commercial
  'Shron',                          // Short
  'Why Russia Started the War',     // Documentary
  'Porsche Cayenne',                // Car Reviews
  'NZK - Utki (Unreleased)',        // Music
  'KADDR: Xiaomi 11T Pro Review',   // Product
])

// ---------------------------------------------------------------- helpers

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** LexoRank shape used by @sanity/orderable-document-list. Fixed width so it
 *  sorts lexicographically. Dragging in the Studio rewrites these. */
const orderRank = (i: number) => `0|${((i + 1) * 1000).toString(36).padStart(6, '0')}:`

/** Stable per-document _key so re-runs don't churn array items. */
const keyFor = (...parts: (string | number)[]) => slugify(parts.join('-')).slice(0, 40)

const log = (...a: unknown[]) => console.log(...a)
const warn = (...a: unknown[]) => console.warn('  !', ...a)

// ------------------------------------------------------------ asset upload

const manifestFile = Bun.file(MANIFEST)
const manifest: Record<string, string> = (await manifestFile.exists())
  ? await manifestFile.json()
  : {}

const saveManifest = () => Bun.write(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

type Client = ReturnType<typeof createClient>

async function uploadImage(client: Client | null, relPath: string) {
  if (manifest[relPath]) return manifest[relPath]

  const file = Bun.file(path.join(IMAGE_DIR, relPath))
  if (!(await file.exists())) {
    warn(`missing file, skipped: ${relPath}`)
    return null
  }

  if (DRY_RUN || !client) return `image-DRYRUN-${slugify(relPath)}`

  const asset = await client.assets.upload('image', file, {
    filename: path.basename(relPath),
  })
  manifest[relPath] = asset._id
  await saveManifest()
  log(`    uploaded ${relPath} -> ${asset._id}`)
  return asset._id
}

// ------------------------------------------------------------------- main

async function main() {
  if (!DRY_RUN) {
    if (!PROJECT_ID) throw new Error('SANITY_STUDIO_PROJECT_ID is not set (check .env.local)')
    if (!TOKEN) throw new Error('SANITY_WRITE_TOKEN is not set (check .env.local)')
  }

  // In dry-run the client is never touched: uploadImage returns a fake asset id
  // and nothing is committed, so there's no reason to require credentials.
  const client: Client | null = DRY_RUN
    ? null
    : createClient({
        projectId: PROJECT_ID,
        dataset: DATASET,
        token: TOKEN,
        apiVersion: '2024-10-01',
        useCdn: false,
      })

  const items: PortfolioItemType[] = portfolioData

  log(`\nLoaded ${items.length} projects from portfolioData.ts`)
  log(`Mode: ${DRY_RUN ? 'DRY RUN' : OVERWRITE ? 'OVERWRITE' : 'CREATE IF MISSING'}`)
  if (!DRY_RUN) log(`Target: project ${PROJECT_ID}, dataset ${DATASET}`)
  log('')

  // --- slug collisions are silent data loss; fail before writing anything ---
  const seen = new Map<string, string>()
  for (const item of items) {
    const s = slugify(item.title)
    if (seen.has(s)) {
      throw new Error(`Slug collision "${s}": "${seen.get(s)}" and "${item.title}"`)
    }
    seen.set(s, item.title)
  }

  // ------------------------------------------------------------ categories
  const categoryNames = [...new Set(items.map((i) => i.category))]
  const categoryDocs = categoryNames.map((title, i) => ({
    _id: `category-${slugify(title)}`,
    _type: 'category',
    title,
    slug: { _type: 'slug', current: slugify(title) },
    orderRank: orderRank(i),
  }))

  log(`Categories (${categoryDocs.length}): ${categoryNames.join(', ')}\n`)

  // -------------------------------------------------------------- services
  // Services are documents too, so projects reference them rather than
  // repeating strings. Order follows first appearance in portfolioData.
  const serviceNames = [...new Set(items.flatMap((i) => i.services || []))]
  const serviceDocs = serviceNames.map((title, i) => ({
    _id: `service-${slugify(title)}`,
    _type: 'service',
    title,
    slug: { _type: 'slug', current: slugify(title) },
    orderRank: orderRank(i),
  }))

  log(`Services (${serviceDocs.length}): ${serviceNames.join(', ')}\n`)

  // -------------------------------------------------------------- projects
  const projectDocs: Record<string, unknown>[] = []

  for (const [i, item] of items.entries()) {
    const slug = slugify(item.title)
    log(`[${String(i + 1).padStart(2)}/${items.length}] ${item.title}`)

    // thumbnail is deliberately dropped: it duplicated images[0], and two
    // entries pointed at files that were never in the repo.
    if (item.thumbnail && !(item.images || []).includes(item.thumbnail)) {
      warn(`thumbnail not in images, dropped: ${item.thumbnail}`)
    }

    const images = []
    for (const [j, relPath] of (item.images || []).entries()) {
      const assetId = await uploadImage(client, relPath)
      if (!assetId) continue
      images.push({
        _type: 'image',
        _key: keyFor(slug, 'img', j),
        asset: { _type: 'reference', _ref: assetId },
      })
    }

    if (!images.length) {
      warn(`no usable images, project skipped entirely: ${item.title}`)
      continue
    }

    const videos = (item.videos || []).map((v, j) => ({
      _key: keyFor(slug, 'vid', j),
      url: v.url,
      // every label in the source data is the literal "Play video", which is
      // already the component's default. Only carry real labels across.
      ...(v.label && v.label !== 'Play video' ? { label: v.label } : {}),
    }))

    projectDocs.push({
      _id: `project-${slug}`,
      _type: 'project',
      title: item.title,
      slug: { _type: 'slug', current: slug },
      description: item.description,
      services: (item.services || []).map((title, j) => ({
        _key: keyFor(slug, 'svc', j),
        _type: 'reference',
        _ref: `service-${slugify(title)}`,
      })),
      category: { _type: 'reference', _ref: `category-${slugify(item.category)}` },
      images,
      ...(videos.length ? { videos } : {}),
      featured: FEATURED.has(item.title),
      publishedToSearch: false, // lift per project once body + credits are filled in
      orderRank: orderRank(i),
    })
  }

  // ----------------------------------------------------------------- write
  const all = [...categoryDocs, ...serviceDocs, ...projectDocs]

  if (DRY_RUN) {
    log(`\nDRY RUN — would write ${all.length} documents`)
    log(`  ${categoryDocs.length} categories, ${serviceDocs.length} services, ${projectDocs.length} projects`)
    log(`  featured: ${projectDocs.filter((p) => p.featured).map((p) => p.title).join(', ')}`)
    log(`\nSample project:\n${JSON.stringify(projectDocs[0], null, 2)}`)
    return
  }

  const tx = client!.transaction()
  for (const doc of all) {
    OVERWRITE ? tx.createOrReplace(doc as never) : tx.createIfNotExists(doc as never)
  }
  await tx.commit()

  log(
    `\nWrote ${all.length} documents (${categoryDocs.length} categories, ${serviceDocs.length} services, ${projectDocs.length} projects)`,
  )
  log(`Uploaded assets cached in ${path.relative(ROOT, MANIFEST)} — keep it if you re-run.`)
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message)
  process.exit(1)
})
