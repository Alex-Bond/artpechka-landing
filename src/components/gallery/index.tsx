import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { GalleryProvider } from './GalleryContext'
import { useGalleryContext } from './hooks'
import { GalleryContent } from './GalleryContent'
import { GalleryProps } from './types'

const Gallery = (props: GalleryProps) => {
  const { alt, images, rotate } = props
  
  return (
    <GalleryProvider images={images} alt={alt} rotate={rotate}>
      <GalleryWrapper />
    </GalleryProvider>
  )
}

const GalleryWrapper = () => {
  const { isFullscreen, toggleFullscreen, alt } = useGalleryContext()
  
  return (
    <>
      <div className="group relative">
        <GalleryContent />
      </div>

      <Dialog open={isFullscreen} onOpenChange={toggleFullscreen}>
        <DialogContent className="max-w-[98vw] w-full h-[98vh] p-0 overflow-hidden bg-transparent border-0">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <GalleryContent />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Gallery