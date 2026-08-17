/**
 * Upload monochrome client logos and attach them to their client documents.
 *
 *   bun run logos:upload -- --dry-run   show what would happen
 *   bun run logos:upload                upload and patch
 *
 * Assets are uploaded once and reused: if a client already has a logo it is
 * left alone unless --replace is passed. Logos live in Sanity, not the repo —
 * same reasoning as the stills.
 *
 * Bun loads .env.local. Needs SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN.
 */

import { createClient } from '@sanity/client'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const REPLACE = process.argv.includes('--replace')

const DIR = process.argv.find((a) => a.startsWith('--dir='))?.slice(6)
if (!DIR) throw new Error('pass --dir=<folder containing the prepared svg files>')

/** file in --dir  ->  client document, created if it does not exist yet */
const LOGOS = [
  { file: 'xiaomi-mono.svg', clientId: 'client-xiaomi', name: 'Xiaomi' },
  { file: 'hotline-mono.svg', clientId: 'client-hotline-ua', name: 'Hotline.ua' },
  { file: 'caterpillar-mono.svg', clientId: 'client-caterpillar', name: 'Caterpillar' },
]

const orderRank = (i: number) => `0|${((i + 1) * 1000).toString(36).padStart(6, '0')}:`

async function main() {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID
  const token = process.env.SANITY_WRITE_TOKEN
  if (!projectId) throw new Error('SANITY_STUDIO_PROJECT_ID is not set')
  if (!DRY_RUN && !token) throw new Error('SANITY_WRITE_TOKEN is not set')

  const client = createClient({
    projectId,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    token,
    apiVersion: '2024-10-01',
    useCdn: false,
  })

  const existing: { _id: string; name: string; hasLogo: boolean }[] = await client.fetch(
    `*[_type == "client"]{ _id, name, "hasLogo": defined(logo.asset) }`,
  )
  const byId = new Map(existing.map((doc) => [doc._id, doc]))

  console.log(`\nMode: ${DRY_RUN ? 'DRY RUN' : 'WRITE'}${REPLACE ? ' (replacing existing logos)' : ''}\n`)

  for (const entry of LOGOS) {
    const doc = byId.get(entry.clientId)
    const file = Bun.file(path.join(DIR, entry.file))
    if (!(await file.exists())) throw new Error(`missing file: ${entry.file}`)

    if (doc?.hasLogo && !REPLACE) {
      console.log(`  ${entry.name.padEnd(14)} already has a logo — skipped`)
      continue
    }

    const bytes = (await file.arrayBuffer()).byteLength
    console.log(
      `  ${entry.name.padEnd(14)} ${entry.file.padEnd(22)} ${String(bytes).padStart(6)} bytes` +
        `  ${doc ? '-> existing client' : '-> NEW client'}`,
    )

    if (DRY_RUN) continue

    const asset = await client.assets.upload('image', file, { filename: entry.file })

    if (!doc) {
      await client.createIfNotExists({
        _id: entry.clientId,
        _type: 'client',
        name: entry.name,
        invertLogo: false,
        orderRank: orderRank(existing.length + LOGOS.indexOf(entry)),
      } as never)
    }

    await client
      .patch(entry.clientId)
      .set({ logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
      .commit()

    console.log(`    uploaded ${asset._id}`)
  }

  if (!DRY_RUN) {
    const withLogo = await client.fetch(`count(*[_type == "client" && defined(logo.asset)])`)
    console.log(`\n${withLogo} clients now have a logo.`)
  }
}

main().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
