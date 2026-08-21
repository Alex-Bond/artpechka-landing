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

/**
 * file in --dir  ->  client document, created if it does not exist yet.
 *
 * The order of this list is also the order the hero shows them in: the strip
 * takes the first five clients that have a logo, so uploading is only half the
 * job — the ranks below lift these above the clients that have none.
 */
const LOGOS = [
  // `scale` is the Studio's Size nudge. The three wordmarks are left at 1: for
  // a wordmark the box height is the letter height, so they only look level
  // when they are level. Amo's lettering is a third of its artwork — the rest
  // is the diagonal — and Chemonics' sits beside a mark, so both need lifting
  // to read at the same size as their neighbours.
  {
    file: 'amo-pictures-mono.svg',
    clientId: 'client-amo-pictures',
    name: 'Amo Pictures',
    scale: 1.25,
  },
  { file: 'panasonic-mono.svg', clientId: 'client-panasonic', name: 'Panasonic', scale: 1 },
  { file: 'caterpillar-mono.svg', clientId: 'client-caterpillar', name: 'Caterpillar', scale: 1 },
  { file: 'hotline-mono.svg', clientId: 'client-hotline-ua', name: 'Hotline.ua', scale: 1 },
  {
    file: 'chemonics-mono.svg',
    clientId: 'client-chemonics-int',
    name: 'Chemonics International',
    scale: 1.1,
  },
]

/**
 * LexoRank sorts as a plain string, so a short numeric tail beats every rank
 * Sanity has generated so far ('000001' < '00000a') and lands these at the top
 * of the Studio list without touching the ranks of anything below.
 */
const orderRank = (i: number) => `0|${String(i + 1).padStart(6, '0')}:`

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

  for (const [index, entry] of LOGOS.entries()) {
    const doc = byId.get(entry.clientId)
    const file = Bun.file(path.join(DIR, entry.file))
    if (!(await file.exists())) throw new Error(`missing file: ${entry.file}`)

    const keepLogo = doc?.hasLogo && !REPLACE
    const bytes = (await file.arrayBuffer()).byteLength

    console.log(
      `  ${entry.name.padEnd(24)} ${entry.file.padEnd(24)} ${String(bytes).padStart(6)} bytes` +
        `  rank ${index + 1}` +
        `  ${!doc ? '-> NEW client' : keepLogo ? '-> keeping existing logo' : '-> existing client'}`,
    )

    if (DRY_RUN) continue

    if (!doc) {
      await client.createIfNotExists({
        _id: entry.clientId,
        _type: 'client',
        name: entry.name,
        invertLogo: false,
        logoScale: entry.scale,
      } as never)
    }

    // Name and rank are patched every run, logo only when there is a new one:
    // the position in the strip is decided here, not in the Studio, so a rerun
    // is how the row gets put back the way this file describes it.
    const patch: Record<string, unknown> = {
      name: entry.name,
      orderRank: orderRank(index),
      logoScale: entry.scale,
    }

    if (!keepLogo) {
      const asset = await client.assets.upload('image', file, { filename: entry.file })
      patch.logo = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      console.log(`    uploaded ${asset._id}`)
    }

    await client.patch(entry.clientId).set(patch).commit()
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
