import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGalleryContext } from './hooks'

export const GalleryNavigation = () => {
  const {
    hasMultipleImages,
    nextImage,
    prevImage,
    currentImage,
    images,
    isFullscreen
  } = useGalleryContext()

  if (!hasMultipleImages) return null

  return (
    <>
      <button
        onClick={prevImage}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 bg-cinema-background/80 hover:bg-cinema-muted p-1 rounded-full text-cinema-text transition-opacity",
          isFullscreen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextImage}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 bg-cinema-background/80 hover:bg-cinema-muted p-1 rounded-full text-cinema-text transition-opacity",
          isFullscreen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        <ChevronRight size={20} />
      </button>

      <div className={cn(
        "absolute bottom-2 left-1/2 -translate-x-1/2 bg-cinema-background/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs transition-opacity",
        isFullscreen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )}>
        {currentImage + 1} / {images.length}
      </div>
    </>
  )
}
