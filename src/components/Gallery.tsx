
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryProps {
  images: string[];
  alt: string;
}

const Gallery = ({ images, alt }: GalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      intervalRef.current = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 2000); // Change image every 2 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, hasMultipleImages, images.length]);

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

  return (
    <div 
      className="relative aspect-video overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }}
    >
      <img 
        src={images[currentImage]} 
        alt={alt} 
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          isHovered ? "scale-110" : "scale-100"
        )}
        style={{
          transform: `scale(${isHovered ? '1.1' : '1'}) translateX(0)`,
          transition: 'transform 700ms ease-in-out'
        }}
      />
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-cinema-background/90 to-transparent opacity-80 transition-opacity duration-300",
        isHovered ? "opacity-90" : "opacity-70"
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
    </div>
  );
};

export default Gallery;
