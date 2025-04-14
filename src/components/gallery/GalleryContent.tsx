import { Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGalleryContext } from './hooks'
import { GalleryNavigation } from './GalleryNavigation'

export const GalleryContent = () => {
  const {
    currentImage,
    images,
    alt,
    isFullscreen,
    toggleFullscreen,
    rotate,
  } = useGalleryContext()

  return (
    <div className={cn(
      'relative overflow-hidden',
      isFullscreen ? 'h-[95vh]' : 'aspect-video',
    )}>
      <img
        src={images[currentImage]}
        alt={alt}
        className={cn(
          'w-full h-full object-contain transition-all duration-700',
          rotate && !isFullscreen ? 'scale-110' : 'scale-100',
        )}
        style={{
          transform: `translateX(0)`,
          animation: 'slideLeft 700ms ease-in-out',
        }}
      />
      <div className={cn(
        'absolute inset-0 bg-gradient-to-t from-cinema-background/90 to-transparent opacity-80 transition-opacity duration-300',
        rotate && !isFullscreen ? 'opacity-90' : 'opacity-70',
      )}></div>

      <GalleryNavigation />

      {!isFullscreen &&
        <button
          onClick={toggleFullscreen}
          className={cn(
            'absolute bottom-2 right-2 bg-cinema-background/50 hover:bg-cinema-muted p-1.5 rounded-full text-cinema-text transition-opacity',
            isFullscreen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        >
          <Maximize2 size={18} />
        </button>
      }
    </div>
  )
}
