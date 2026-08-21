import { useMemo, useState } from 'react'
import type { ResponsiveImage } from '../../lib/image'
import { track } from '../../lib/analytics'
import { ProjectCard, type CardProject } from './ProjectCard'

export type { CardProject }

interface Props {
  projects: CardProject[]
  categories: string[]
}

const PAGE_SIZE = 6

export default function PortfolioGrid({ projects, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showAll, setShowAll] = useState(false)

  // Studio drag order is the only thing that decides the sequence — filtering by
  // category preserves it, and nothing gets hoisted to the front.
  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [projects, activeCategory],
  )

  const displayed = showAll ? filtered : filtered.slice(0, PAGE_SIZE)
  const hasMore = filtered.length > PAGE_SIZE

  const changeCategory = (category: string) => {
    track('filter_portfolio', { event_category: category })
    setActiveCategory(category)
    setShowAll(false)
  }

  return (
    <>
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {['All', ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => changeCategory(category)}
            aria-pressed={activeCategory === category}
            className={
              'rounded-full px-4 py-2 text-sm transition-colors ' +
              (activeCategory === category
                ? 'bg-cinema-accent text-cinema-accentOn'
                : 'bg-cinema-muted text-cinema-text/70 hover:bg-cinema-muted/70')
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayed.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {hasMore && !showAll && (
          <button type="button" className="btn-primary" onClick={() => setShowAll(true)}>
            View All
          </button>
        )}
        {/* The archive is the crawlable route to every project page. */}
        <a href="/work" className="btn-secondary">
          Browse the full archive
        </a>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {displayed.length} of {filtered.length} projects
        {activeCategory === 'All' ? '' : ` in ${activeCategory}`}.
      </p>
    </>
  )
}

export type { ResponsiveImage }
