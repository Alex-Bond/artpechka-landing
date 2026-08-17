/**
 * One-off: project.services  string[]  ->  reference[] to `service` documents.
 *
 *   bun run migrate:services -- --dry-run   show what would change
 *   bun run migrate:services                create services and rewrite projects
 *
 * Idempotent. Projects whose services are already references are left alone, so
 * a second run is a no-op. Before writing anything it dumps the current string
 * arrays to scripts/.services-backup.json — that file is the undo.
 *
 * Bun loads .env.local. Needs SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN.
 */

import { createClient } from '@sanity/client'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dir, '..')
const BACKUP = path.join(ROOT, 'scripts/.services-backup.json')

const DRY_RUN = process.argv.includes('--dry-run')

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'
const TOKEN = process.env.SANITY_WRITE_TOKEN

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Same fixed-width LexoRank shape the other lists use. */
const orderRank = (i: number) => `0|${((i + 1) * 1000).toString(36).padStart(6, '0')}:`

const log = (...a: unknown[]) => console.log(...a)

interface RawProject {
  _id: string
  title: string
  services: (string | { _ref?: string; _type?: string })[] | null
}

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

  const projects: RawProject[] = await client.fetch(
    `*[_type == "project"] | order(orderRank) { _id, title, services }`,
  )

  const stringServices = (project: RawProject) =>
    (project.services ?? []).filter((s): s is string => typeof s === 'string')

  const needsWork = projects.filter((p) => stringServices(p).length > 0)
  const alreadyDone = projects.length - needsWork.length

  log(`\n${projects.length} projects: ${needsWork.length} to convert, ${alreadyDone} already references`)
  log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'WRITE'} — project ${PROJECT_ID}, dataset ${DATASET}\n`)

  if (needsWork.length === 0) {
    log('Nothing to do.')
    return
  }

  // Service documents, ordered by first appearance across projects, plus any
  // that already exist in the dataset so ranks don't collide.
  const existing: { _id: string; title: string }[] = await client.fetch(
    `*[_type == "service"] { _id, title }`,
  )
  const existingIds = new Set(existing.map((s) => s._id))

  // Seed the Services list in the order the old hardcoded constant used, rather
  // than by first appearance across projects. Artem can drag it after this.
  const CANONICAL = [
    'Editing',
    'Motion design',
    'Color Grading',
    'Sound design',
    'Filming',
    'Compositing',
    'Directing',
    'Sound mixing',
    'Tutoring',
  ]
  const rank = (title: string) => {
    const i = CANONICAL.indexOf(title)
    return i === -1 ? CANONICAL.length : i
  }
  const names = [...new Set(needsWork.flatMap(stringServices))].sort(
    (a, b) => rank(a) - rank(b) || a.localeCompare(b),
  )
  const serviceDocs = names
    .map((title, i) => ({
      _id: `service-${slugify(title)}`,
      _type: 'service',
      title,
      slug: { _type: 'slug', current: slugify(title) },
      orderRank: orderRank(existing.length + i),
    }))
    .filter((doc) => !existingIds.has(doc._id))

  log(`Services to create (${serviceDocs.length}): ${serviceDocs.map((s) => s.title).join(', ')}`)
  if (existing.length) log(`Already present (${existing.length}): ${existing.map((s) => s.title).join(', ')}`)
  log('')

  const patches = needsWork.map((project) => {
    const titles = stringServices(project)
    return {
      _id: project._id,
      title: project.title,
      before: titles,
      services: titles.map((title, i) => ({
        _key: `${slugify(project.title).slice(0, 30)}-svc-${i}`,
        _type: 'reference',
        _ref: `service-${slugify(title)}`,
      })),
    }
  })

  for (const patch of patches) {
    log(`  ${patch.title}`)
    log(`    ${patch.before.join(', ')}  ->  ${patch.services.map((s) => s._ref).join(', ')}`)
  }

  if (DRY_RUN) {
    log(`\nDRY RUN — would create ${serviceDocs.length} services and patch ${patches.length} projects`)
    return
  }

  await Bun.write(
    BACKUP,
    JSON.stringify(
      patches.map(({ _id, title, before }) => ({ _id, title, services: before })),
      null,
      2,
    ) + '\n',
  )
  log(`\nBacked up previous values to ${path.relative(ROOT, BACKUP)}`)

  const tx = client.transaction()
  for (const doc of serviceDocs) tx.createIfNotExists(doc as never)
  for (const patch of patches) tx.patch(patch._id, { set: { services: patch.services } })
  await tx.commit()

  log(`Created ${serviceDocs.length} services, patched ${patches.length} projects.`)
}

main().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
