
import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from './ui/dialog'

interface GalleryProps {
  images: string[];
  alt: string;
  rotate?: boolean;
}

const Gallery = ({ images, alt, rotate = false }: GalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (hasMultipleImages) {
      if (rotate) {
        intervalRef.current = setInterval(() => {
          setCurrentImage((prev) => (prev + 1) % images.length);
        }, 2000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [rotate, hasMultipleImages, images.length]);

  const nextImage = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const GalleryContent = () => (
    <div className="relative aspect-video overflow-hidden">
      <img
        src={images[currentImage]}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          rotate ? 'scale-110' : 'scale-100',
          isFullscreen ? 'max-h-[80vh]' : ''
        )}
        style={{
          transform: `translateX(0)`,
          animation: 'slideLeft 700ms ease-in-out'
        }}
      />
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-cinema-background/90 to-transparent opacity-80 transition-opacity duration-300",
        rotate ? 'opacity-90' : 'opacity-70',
      )}></div>

      {hasMultipleImages && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-cinema-background/50 hover:bg-cinema-muted p-1 rounded-full text-cinema-text opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-cinema-background/50 hover:bg-cinema-muted p-1 rounded-full text-cinema-text opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cinema-background/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            {currentImage + 1} / {images.length}
          </div>
        </>
      )}

      <button
        onClick={toggleFullscreen}
        className="absolute bottom-2 right-2 bg-cinema-background/50 hover:bg-cinema-muted p-1.5 rounded-full text-cinema-text opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
    </div>
  );

  return (
    <>
      <div className="group relative">
        <GalleryContent />
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-cinema-background/95">
          <GalleryContent />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;
