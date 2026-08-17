/**
 * Seed the Clients list from the names already in Artem's About copy.
 *
 *   bun run seed:clients -- --dry-run   list what would be created
 *   bun run seed:clients                create the missing client documents
 *
 * Purely additive: createIfNotExists only, so re-running never touches a
 * document Artem has edited and never overwrites an uploaded logo. Logos are
 * not seeded — there are none to seed. Until one is uploaded the strip renders
 * the client's name as text.
 *
 * Bun loads .env.local. Needs SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN.
 */

import { createClient } from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'
const TOKEN = process.env.SANITY_WRITE_TOKEN

/**
 * Order is Artem's own, from the About paragraph — the brands he lists first are
 * the ones he leads with. He can drag them in the Studio afterwards.
 */
const NAMES = [
  'Panasonic',
  'Sony',
  'Samsung',
  'Xiaomi',
  'Microsoft/Mojang',
  'ICTV',
  'Tefal',
  'Sennheiser',
  'Renault',
  'Hotline.ua',
  'KLO',
  'keddr',
  'WAW',
  'Chemonics Int',
  'MFA Ukraine',
]

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const orderRank = (i: number) => `0|${((i + 1) * 1000).toString(36).padStart(6, '0')}:`

async function main() {
  if (!PROJECT_ID) throw new Error('SANITY_STUDIO_PROJECT_ID is not set (check .env.local)')
  if (!DRY_RUN && !TOKEN) throw new Error('SANITY_WRITE_TOKEN is not set (check .env.local)')

  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    token: TOKEN,
    apiVersion: '2024-10-01',
    useCdn: false,
  })

  const existing: { _id: string }[] = await client.fetch(`*[_type == "client"]{ _id }`)
  const have = new Set(existing.map((doc) => doc._id))

  const docs = NAMES.map((name, i) => ({
    _id: `client-${slugify(name)}`,
    _type: 'client',
    name,
    invertLogo: false,
    orderRank: orderRank(i),
  })).filter((doc) => !have.has(doc._id))

  console.log(`\n${existing.length} clients already in the dataset, ${docs.length} to create`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'WRITE'} — project ${PROJECT_ID}, dataset ${DATASET}\n`)

  if (docs.length === 0) {
    console.log('Nothing to do.')
    return
  }

  docs.forEach((doc) => console.log(`  ${doc._id.padEnd(28)} ${doc.name}`))

  if (DRY_RUN) {
    console.log(`\nDRY RUN — would create ${docs.length} clients`)
    return
  }

  const tx = client.transaction()
  for (const doc of docs) tx.createIfNotExists(doc as never)
  await tx.commit()

  console.log(`\nCreated ${docs.length} clients. Upload logos in the Studio under Clients.`)
}

main().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
