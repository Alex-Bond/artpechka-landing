import { useEffect, useRef, useState } from 'react'
import type { ResponsiveImage } from '../../lib/image'

export interface CardProject {
  title: string
  slug: string
  description: string
  category: string | null
  client: string | null
  year: number | null
  services: string[]
  videoCount: number
  images: ResponsiveImage[]
}

const ROTATE_MS = 2000

export function ProjectCard({ project }: { project: CardProject }) {
  const { images } = project
  const [index, setIndex] = useState(0)
  const [rotating, setRotating] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const hasMultiple = images.length > 1

  useEffect(() => {
    if (!hasMultiple || !rotating) return
    timer.current = setInterval(() => setIndex((prev) => (prev + 1) % images.length), ROTATE_MS)
    return () => {
      if (timer.current) clearInterval(timer.current)
      timer.current = null
    }
  }, [rotating, hasMultiple, images.length])

  const step = (delta: number) => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
    setRotating(false)
    setIndex((prev) => (prev + delta + images.length) % images.length)
  }

  const current = images[index]
  const meta = [project.client, project.year].filter(Boolean).join(' · ')

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-cinema-muted"
      onMouseEnter={() => setRotating(true)}
      onMouseLeave={() => setRotating(false)}
    >
      <div className="relative aspect-video overflow-hidden bg-cinema-background">
        {/*
          The image and its tint scale together as one layer. Transforming the
          image alone made it a separate compositor layer, and on a fractional
          box height the clip rect rounded out while the tint rounded in —
          leaving one bright, untinted row of the still along the bottom.
        */}
        <div className="absolute inset-0 transition-transform duration-700 md:group-hover:scale-105">
          {current && (
            <img
              src={current.src}
              srcSet={current.srcset}
              sizes={current.sizes}
              width={current.width}
              height={current.height}
              alt={current.alt || project.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
              style={{ backgroundImage: `url(${current.lqip})`, backgroundSize: 'cover' }}
            />
          )}
          <div
            className="pointer-events-none absolute -inset-px bg-gradient-to-t from-cinema-background/90 to-transparent opacity-70 transition-opacity duration-300 md:group-hover:opacity-90"
            aria-hidden="true"
          />
        </div>

        {(project.category || meta) && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-white/85 px-2 py-0.5 text-xs font-medium text-black">
            {meta || project.category}
          </span>
        )}

        {hasMultiple && (
          <>
            {/*
              Always visible on touch, hover-revealed on pointer devices. In the
              old build these were group-hover only, which made 30 of the 33
              multi-image galleries unreachable on a phone.
            */}
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous still"
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-cinema-background/80 p-1.5 text-cinema-text transition-opacity hover:bg-cinema-muted md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next still"
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-cinema-background/80 p-1.5 text-cinema-text transition-opacity hover:bg-cinema-muted md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full bg-cinema-background/90 px-2 py-0.5 text-xs backdrop-blur-sm">
              {index + 1} / {images.length}
            </span>
          </>
        )}

        {project.videoCount > 0 && (
          <span className="absolute bottom-2 right-2 z-20 flex items-center gap-1 rounded-full bg-cinema-background/90 px-2 py-0.5 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {project.videoCount > 1 ? `${project.videoCount} videos` : 'Video'}
          </span>
        )}
      </div>

      <div className="flex flex-grow flex-col p-6">
        <h3 className="mb-2 text-xl font-bold">
          {/*
            The stretched link makes the whole card a single target — one path to
            the project, which is why the old play-in-a-modal dialog is gone.
          */}
          <a href={`/work/${project.slug}`} className="after:absolute after:inset-0 after:z-10">
            {project.title}
          </a>
        </h3>
        <p className="mb-4 flex-grow text-sm text-cinema-text/70">{project.description}</p>

        <div>
          <h4 className="mb-2 text-xs uppercase text-cinema-text/50">Services</h4>
          <div className="flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span
                key={service}
                className="rounded-full bg-cinema-background px-2 py-1 text-xs text-cinema-text/70"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
